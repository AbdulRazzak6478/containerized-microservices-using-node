const { StatusCodes } = require('http-status-codes');
const { AirplaneRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');

const airplaneRepository = new AirplaneRepository();

async function createAirplane(data)
{
    try {
        const airplane = await airplaneRepository.create(data);
        return airplane;
    } catch (error) {
        let explanation = [];
        console.log('airplane service error ,',error);
        if(error.name == 'TypeError')
        {
            console.log("inside error ",error);
            throw new AppError('Cannot create a new airplane object',StatusCodes.INTERNAL_SERVER_ERROR)
        }
        if(error.name == 'SequelizeValidationError')
        {
            error.errors.forEach(err => {
                explanation.push(err.message)
            });
            console.log("inside error ",explanation);
            throw new AppError(explanation,StatusCodes.BAD_REQUEST)
        } 
        throw new AppError('Cannot create a new airplane object',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getAirplanes()
{
    try {
        const airplanes = await airplaneRepository.getAll();
        return airplanes;
    } catch (error) {
        throw new AppError('Cannot fetch data of all airplanes',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getAirplane(id)
{
    try {
        const airplane = await airplaneRepository.get(id);
        return airplane;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND)
        {
            throw new AppError("The airplane you requested is not found",error.statusCode);
        }
        throw new AppError('Cannot fetch data of airplane',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function destroyAirplane(id)
{
    try {
        const response = await airplaneRepository.destroy(id);
        return response;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND)
        {
            throw new AppError("The airplane you requested to Delete is not found",error.statusCode);
        }
        throw new AppError('Cannot fetch data of airplane',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}
async function updateAirplane(id,data)
{
    try {
        const updated_airplane = await airplaneRepository.update(id,data);
        return updated_airplane;
    } catch (error) {
        let explanation = [];
        if(error.name == 'TypeError')
        {
            throw new AppError('Cannot create a new airplane object',StatusCodes.INTERNAL_SERVER_ERROR)
        }
        if(error.name == 'SequelizeValidationError')
        {
            error.errors.forEach(err => {
                explanation.push(err.message)
            });
            throw new AppError(explanation,StatusCodes.BAD_REQUEST)
        } 
        throw new AppError('Cannot Update data of airplane',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}
module.exports = {
    createAirplane,
    getAirplanes,
    getAirplane,
    destroyAirplane,
    updateAirplane,
}