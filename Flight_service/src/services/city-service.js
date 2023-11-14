const { StatusCodes } = require('http-status-codes');
const { CityRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');

const cityRepository = new CityRepository()

async function createCity(data)
{
    try {
        const city = await cityRepository.create(data);
        return city;
    } catch (error) {
        let explanation = [];
        console.log("city service error ,",error);
        if(error.name == 'TypeError')
        {
            console.log("inside error ",error);
            throw new AppError('Cannot create a new city',StatusCodes.INTERNAL_SERVER_ERROR)
        }
        if(error.name == 'SequelizeValidationError' || error.name == "SequelizeUniqueConstraintError")
        {
            error.errors.forEach(err => {
                explanation.push(err.message)
            });
            console.log("inside error ",explanation);
            throw new AppError(explanation,StatusCodes.BAD_REQUEST)
        } 
        throw new AppError('Cannot create a new city object',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getCity(id)
{
    try {
        const city = await cityRepository.get(id);
        console.log("city response :",city);
        return city;
    } catch (error) {
        console.log("city response :",error);
        if(error.statusCode == StatusCodes.NOT_FOUND)
        {
            throw new AppError("The Cities you requested is not found",error.statusCode);
        }
        throw new AppError('Cannot fetch data of city1',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}
async function getCities()
{
    try {
        const city = await cityRepository.getAll();
        console.log("city response :",city);
        return city;
    } catch (error) {
        console.log("city response :",error);
        if(error.statusCode == StatusCodes.NOT_FOUND)
        {
            throw new AppError("The Cities you requested are not found",error.statusCode);
        }
        throw new AppError('Cannot fetch data of city1',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function destroyCity(id)
{
    try {
        const response = await cityRepository.destroy(id);
        return response;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND)
        {
            throw new AppError('The airplane you requested to Delete is not found',error.statusCode);
        }
        throw new AppError('Cannot fetch data of airplane',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function updateCity(id,data)
{
    try {
        const updated_city = await cityRepository.update(id,data);
        console.log("updated city object : ",updated_city);
        return updated_city;
    } catch (error) {
        let explanation = [];
        if(error.name == 'TypeError')
        {
            throw new AppError('Cannot update a new city object',StatusCodes.INTERNAL_SERVER_ERROR)
        }
        if(error.name == 'SequelizeValidationError')
        {
            error.errors.forEach(err => {
                explanation.push(err.message)
            });
            throw new AppError(explanation,StatusCodes.BAD_REQUEST)
        } 
        console.log("error :",error);
        // throw new AppError('Cannot Update data of city',StatusCodes.INTERNAL_SERVER_ERROR)
        throw new AppError(error.explanation,error.statusCode)
    }
}

module.exports = {
    createCity,
    getCity,
    getCities,
    destroyCity,
    updateCity,
}