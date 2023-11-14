
const axios = require('axios');

const { BookingRepository } = require('../repositories')
const db = require('../models');
const { ServerConfig ,Queue} = require('../config');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
// const { log } = require('winston');
const { Enums }  = require('../utils/common');
const { BOOKED, CANCELLED, INITIATED, PENDING} = Enums.BOOKING_STATUS;

const bookingRepository = new BookingRepository();

async function createBooking(data)
{
    const transaction =await db.sequelize.transaction();
   try {
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`)
        const flightData = flight.data.data;
        if(data.noOfSeats > flightData.totalSeats)
        {
            throw new AppError('Not enough seats available',StatusCodes.BAD_REQUEST);
            // throw {message:'No of seats exceeds available seat'}
        } 
        const totalBillingAmt = data.noOfSeats * flightData.price;
        console.log('total Billing amount',totalBillingAmt);
        const bookingPayload = {...data, totalCost: totalBillingAmt};
        const booking = await bookingRepository.createBooking(bookingPayload, transaction);

        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats `,{
            seats: data.noOfSeats
        })
        await transaction.commit();
        return booking;
   } catch (error) {
    console.log('create booking service error',error.statusCode);
       await transaction.rollback();
       throw error;
   }
}

async function makePayment(data)
{
    const transaction =await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId,transaction);
        if(bookingDetails.status == CANCELLED)
        {
            throw new AppError('The Booking has Expired!, Booking initiated 10 minutes time is over',StatusCodes.BAD_REQUEST);
        }
        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        if(currentTime - bookingTime > 300000) // for 10 minutes
        {
            await cancelBooking(data.bookingId);
            throw new AppError('The Booking has Expired!, Booking initiated 10 minutes time is over',StatusCodes.BAD_REQUEST);
        }
        if(bookingDetails.totalCost != data.totalCost)
        {
            throw new AppError('The amount of the payment does not match',StatusCodes.BAD_REQUEST);
        }
        if(bookingDetails.userId != data.userId)
        {
            throw new AppError('The user corresponding to the booking does not match',StatusCodes.BAD_REQUEST);
        }
        // we assume here that payment is successfull

        const response = await bookingRepository.update(data.bookingId,{status:BOOKED},transaction);

        await transaction.commit();


        const userData = await axios.get(`${ServerConfig.AUTH_SERVICE}/api/v1/user/${data.userId}`)
        const userEmail = userData.data.data.email;

        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}`)
        const flightData = flight.data.data;
        const booking_content = JSON.parse(JSON.stringify(bookingDetails));
        const flight_content = JSON.parse(JSON.stringify(flightData));
        await Queue.sendData({
            recepientEmail : userEmail,
            subject:`Seat Booked for the Flight ${flightData.flightNumber}`,
            text : `Booking Successfully done the with bookingId  : ${bookingDetails.id} and FlightId : ${flightData.id}`,
            // booking_details : booking_content,
            // flight_details : flight_content,
        })
        return response;
    } catch (error) {
        console.log('booking service makePayment error',error);
        await transaction.rollback();
        throw error;
    }
}

async function cancelBooking(bookingId)
{
    const transaction =await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(bookingId,transaction);
        if(bookingDetails.status == CANCELLED)
        {
            await transaction.commit();
            return true; 
        }
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats `,{
            seats: bookingDetails.noOfSeats,
            dec:0,
        })
        await bookingRepository.update(data.bookingId,{status:CANCELLED},transaction);

        await transaction.commit();
    } catch (error) {
        console.log('booking service cancelBooking error : ',error);
        await transaction.rollback();
        throw error;
    }
}

async function cancelOldBookings(){
    try {
        const time = new Date(Date.now() - 1000*600); // time 10 min ago
        const response = await bookingRepository.cancelOldBookings(time);
        return response;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createBooking,
    makePayment,
    cancelOldBookings,
}