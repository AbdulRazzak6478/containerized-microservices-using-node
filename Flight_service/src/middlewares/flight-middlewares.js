const { StatusCodes } = require("http-status-codes");

const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { compareTime } = require("../utils/helpers/compareTime");

function validateCreateRequest(req, res, next) {
  if (!req.body.flightNumber) {
    ErrorResponse.message = "Something went wrong while creating flight";
    ErrorResponse.error = new AppError(
      ["flightNumber not found in the oncoming request in the correct form"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.airplaneId) {
    ErrorResponse.message = "Something went wrong while creating flight";
    ErrorResponse.error = new AppError(
      ["airplaneId not found in the oncoming request in the correct form"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.departureAirportId) {
    ErrorResponse.message = "Something went wrong while creating flight";
    ErrorResponse.error = new AppError(
      [
        "departureAirportId not found in the oncoming request in the correct form",
      ],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.arrivalAirportId) {
    ErrorResponse.message = "Something went wrong while creating flight";
    ErrorResponse.error = new AppError(
      [
        "departureAirportId not found in the oncoming request in the correct form",
      ],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.arrivalTime) {
    ErrorResponse.message = "Something went wrong while creating flight";
    ErrorResponse.error = new AppError(
      ["arrivalTime not found in the oncoming request in the correct form"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.departureTime) {
    ErrorResponse.message = "Something went wrong while creating flight";
    ErrorResponse.error = new AppError(
      ["departureTime not found in the oncoming request in the correct form"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.price) {
    ErrorResponse.message = "Something went wrong while creating flight";
    ErrorResponse.error = new AppError(
      ["price not found in the oncoming request in the correct form"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.totalSeats) {
    ErrorResponse.message = "Something went wrong while creating flight";
    ErrorResponse.error = new AppError(
      ["totalSeats not found in the oncoming request in the correct form"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  next();
}

function checkRequestParameters(req, res, next){

  const isTimeTrue = compareTime(req.body.arrivalTime, req.body.departureTime);
  if(!isTimeTrue)
  {
    ErrorResponse.message = "Something went wrong in flight parameters";
    ErrorResponse.error = new AppError(
      ["Flight arrivalTime should be greater then departureTime in the oncoming request parameters"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if(req.body.price <= 0 || isNaN(req.body.price))
  {
    ErrorResponse.message = "Something went wrong in flight parameters";
    ErrorResponse.error = new AppError(
      ["Flight price is not valid in the oncoming request parameters"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if(req.body.totalSeats <= 0 || isNaN(req.body.totalSeats))
  {
    ErrorResponse.message = "Something went wrong in flight parameters";
    ErrorResponse.error = new AppError(
      ["Flight totalSeats are not valid in the oncoming request parameters"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if(req.body.airplaneId <= 0 || isNaN(req.body.airplaneId))
  {
    ErrorResponse.message = "Something went wrong in flight parameters";
    ErrorResponse.error = new AppError(
      ["Flight airplaneId is not valid in the oncoming request parameters"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  
  next();

}

function validateUpdateSeatsRequest(req, res, next){
  // if (!req.body.flightId) {
  //   ErrorResponse.message = "Something went wrong while updating flight";
  //   ErrorResponse.error = new AppError(
  //     ["flightId not found in the oncoming request in the correct form"],
  //     StatusCodes.BAD_REQUEST
  //   );
  //   return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  // }
  if (!req.body.seats) {
    ErrorResponse.message = "Something went wrong while updating flight";
    ErrorResponse.error = new AppError(
      ["seats not found in the oncoming request in the correct form"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  next();
}

module.exports = {
  validateCreateRequest,
  checkRequestParameters,
  validateUpdateSeatsRequest
};
