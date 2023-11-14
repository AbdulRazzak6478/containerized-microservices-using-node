const { StatusCodes } = require("http-status-codes");

const { ErrorResponse} = require('../utils/common');
const AppError = require("../utils/errors/app-error");

function validateCreateRequest(req, res, next) {
  if (!req.body.modelNumber) {
    ErrorResponse.message =  'Something went wrong while creating airplane';
    // ErrorResponse.error = {explanation:'model number is not found in onComing request in correct format'}
    ErrorResponse.error = new AppError(['model number is not found in onComing request in correct format'],StatusCodes.BAD_REQUEST)
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  else if (!req.body.capacity) {
    ErrorResponse.message =  'Something went wrong while creating airplane';
    // ErrorResponse.error = {explanation:'model number is not found in onComing request in correct format'}
    ErrorResponse.error = new AppError(['capacity is not found in onComing request in correct format'],StatusCodes.BAD_REQUEST)
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  next();
}

module.exports = {
    validateCreateRequest,
}
