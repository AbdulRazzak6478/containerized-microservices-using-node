const { StatusCodes } = require("http-status-codes");

const { CityService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

/*
    POST : /cities
    req-body {name :"mumbai"}
*/

async function createCity(req, res) {
  try {
    const city = await CityService.createCity({
      name: req.body.name,
    });
    SuccessResponse.data = city;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function getCity(req, res) {
  try {
    const city = await CityService.getCity(req.params.id);
    SuccessResponse.data = city;
    console.log("get city : ",city);
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function getCities(req, res) {
  try {
    const cities = await CityService.getCities();
    SuccessResponse.data = cities;
    console.log("get cities : ",cities);
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function destroyCity(req,res){
  try {
      const city = await CityService.destroyCity(req.params.id);
      console.log("city object : ",city);
      SuccessResponse.data = city;
      return res.status(StatusCodes.OK).json(SuccessResponse)
  } catch (error) {
    console.log("error city :" ,error);
      ErrorResponse.error = error;
      return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function updateCity(req,res){
  try {
      const updated_city = await CityService.updateCity(req.params.id,{
          name:req.body.name
        });
      SuccessResponse.data = updated_city;
      return res.status(StatusCodes.OK).json(SuccessResponse)
  } catch (error) {
      ErrorResponse.error = error;
      return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
    createCity,
    getCity,
    getCities,
    destroyCity,
    updateCity,
}