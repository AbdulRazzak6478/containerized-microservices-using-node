const { StatusCodes } = require("http-status-codes");

const { ErrorResponse} = require('../utils/common');
const AppError = require("../utils/errors/app-error");
const { UserService } = require("../services");

function validateAuthRequest(req, res, next) {
  if (!req.body.email) {
    ErrorResponse.message =  'Something went wrong while Authenticating  User';
    ErrorResponse.error = new AppError(['email not found in onComing request in correct format'],StatusCodes.BAD_REQUEST)
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.password) {
    ErrorResponse.message =  'Something went wrong while Authenticating  User';
    ErrorResponse.error = new AppError(['password not found in onComing request in correct format'],StatusCodes.BAD_REQUEST)
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  next();
}


async function checkAuth(req, res, next){
  try {
    const bearerHeader = req.headers['x-access-token'];
    if(typeof bearerHeader !=='undefined')
    {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      const response =await UserService.isAuthenticated(bearerToken);
      if(response)
      {
        console.log('user authenticated',response);
        req.user = response;
        next();
      }
    }
    else{
      console.log('no headers2');
      throw new AppError(['x-access-token , jwt token is missing'],StatusCodes.BAD_REQUEST)
    }
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
}

async function isAdmin (req, res, next)
{
  const response = await UserService.isAdmin(req.user);
  if(!response)
  {
    return res.status(StatusCodes.UNAUTHORIZED).json({message:'User not authorized for this action'})
  }
  next();
}

module.exports = {
    validateAuthRequest,
    checkAuth,
    isAdmin
}
