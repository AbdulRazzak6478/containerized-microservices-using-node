const { StatusCodes } = require('http-status-codes');
const { FlightRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { Op } = require('sequelize');
const { AirportRepository } = require('../repositories');
const { getAirportByAttribute } = require('./airport-service');
const airportRepository = new AirportRepository();

const flightRepository = new FlightRepository();

async function createFlight(data)
{
    try {
        const flight = await flightRepository.create(data);
        console.log("service data ",flight);
        return flight;
    } catch (error) {
        let explanation = [];
        console.log('flight service error ,',error);
        if(error.name == 'TypeError')
        {
            console.log("inside error ",error);
            throw new AppError('Cannot create a new flight object',StatusCodes.INTERNAL_SERVER_ERROR)
        }
        if(error.name == 'SequelizeValidationError')
        {
            error.errors.forEach(err => {
                explanation.push(err.message)
            });
            console.log("inside error ",explanation);
            throw new AppError(explanation,StatusCodes.BAD_REQUEST)
        } 
        throw new AppError('Cannot create a new Flight object',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getAllFlights(query)
{
    // trips=MUM-HYD
    let customFilter = {};
    let sortFilter = [];
    let endingTripDate = ' 23:59:00';
    let startingTripDate = ' 00:00:00';
    if(query.trips)
    {
        [departureAirportId, arrivalAirportId] = query.trips.split('-');
        customFilter.departureAirportId = departureAirportId;
        customFilter.arrivalAirportId = arrivalAirportId;
        if(arrivalAirportId === departureAirportId)
        {
            throw new AppError('Cannot fetch flights ! departure and arrival airports Id must not be same in trips',StatusCodes.BAD_REQUEST)
        }
    }

    if(query.price)
    {
        [minPrice, maxPrice] = query.price.split('-');
        customFilter.price = {
            [Op.between]:[minPrice,((maxPrice == undefined) ? 30000:maxPrice)]
        }
    }

    if(query.travellers)
    {
        customFilter.totalSeats = {
            [Op.gte]:query.travellers
        }
    }

    if(query.tripDate)
    {
        // input : 2023-09-14 
        // `Flight`.`departureTime` BETWEEN '2023-09-13 18:30:00' AND '2023-09-14 18:29:00' 
        customFilter.departureTime={
            [Op.between]:[query.tripDate+startingTripDate,query.tripDate+endingTripDate]
        }
    }

    if(query.sort)
    {
        const params = query.sort.split(',');
        const sortFilters = params.map((param)=>param.split('_'));
        sortFilter = sortFilters
    }

   console.log('filter object : ',customFilter)
    try { 
        const flights = await flightRepository.getAllFlights(customFilter,sortFilter);
        
        //  const res = await getFlightAirport(flights,result);
        return flights;
    } catch (error) {
        console.log("error ",error);
        throw new AppError(`Cannot fetch data of filter Flights , ${error?.message}`,error.statusCode ? error.statusCode: StatusCodes.INTERNAL_SERVER_ERROR)
    }

}
async function getFlightAirport(flights)
{
    let resultFlights = [];
    flights.forEach(async(obj,index) => {
        let flight = {...obj.dataValues}
        // console.log('flight : ',flight);
        const desAirport = await getAirportByAttribute(flight.departureAirportId)
        // console.log('destination',desAirport);
        const arrAirport = await getAirportByAttribute(flight.arrivalAirportId)
        // console.log('arrival ',arrAirport);
        flight.departureAirportId = {...desAirport};
        flight.arrivalAirportId = {...arrAirport};
        // console.log('complete flight : ',flight);
        const fl = JSON.parse(JSON.stringify(flight))
        // const fl = {...flight}
        // console.log('fl ',fl);
        // resultFlights.push(JSON.parse(JSON.stringify(flight)));
        // resultFlights.push({...flight}) 
        resultFlights.push(fl)
        console.log('result one ',resultFlights);
        return resultFlights;
    });
    console.log('result',resultFlights);
    return resultFlights;
}


async function getFlight(id)
{
    try {
        const flight = await flightRepository.getBookedFlight(id);
        return flight;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND)
        {
            throw new AppError("The flight you requested is not found",error.statusCode);
        }
        throw new AppError('Cannot fetch data of Flight',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function updateSeats(data)
{
    try {
        const response = await flightRepository.updateRemainingSeats(data.id, data.seats, data.dec);
        return response;
    } catch (error) {
        if(error.name == 'TypeError')
        {
            console.log("inside error ",error);
            throw new AppError(`Cannot update a flight object ${error.message}`,StatusCodes.INTERNAL_SERVER_ERROR)
        }
        console.log("updateSeats  flight error : ",error);
        throw new AppError('Cannot update data of Flight',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

module.exports = {
    createFlight,
    getAllFlights,
    getFlight,
    updateSeats
}