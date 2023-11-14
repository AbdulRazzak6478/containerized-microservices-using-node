const { StatusCodes } = require('http-status-codes');
const { BookingService,IdemKeysService } = require('../services')
const { SuccessResponse, ErrorResponse } = require("../utils/common");

let in_memoDb = {};
async function createBooking(req, res) {
    try {
      const response = await BookingService.createBooking({
        flightId : req.body.flightId,
        userId: req.body.userId,
        noOfSeats : req.body.noOfSeats,
      });
      SuccessResponse.data = response;
      return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
      console.log("error in controller",error);
      ErrorResponse.error = error;
      return res.status(error.statusCode?error.statusCode:StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
  }
async function makePayment(req, res) {
    try {
      const idempotencyKey = req.headers['x-idempotency-key'];
      
      if(!idempotencyKey){
        return res
        .status(StatusCodes.BAD_REQUEST)
        .json({message:'x-idempotency-key:\'token\' , unique key missing'});
      }

      const getIdemkey = await IdemKeysService.getIdemkey(idempotencyKey);

      if(getIdemkey.length!=0)
      {
        ErrorResponse.error={message:'Cannot retry on a successful payment'}
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(ErrorResponse);
      }
      const response = await BookingService.makePayment({
        bookingId : req.body.bookingId,
        userId: req.body.userId,
        totalCost : req.body.totalCost,
      });
      const idemKeyCreate = await IdemKeysService.createIdemKey({
        value:idempotencyKey,
        userId:req.body.userId,
        bookingId:req.body.bookingId
      })
      const bookingPaymentPayload = {...idemKeyCreate.dataValues,totalCost:req.body.totalCost}
      SuccessResponse.data = bookingPaymentPayload;
      return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
      console.log("error in controller",error);
      ErrorResponse.error = error;
      return res.status(error.statusCode?error.statusCode:StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
  }

module.exports = {
    createBooking,
    makePayment
}