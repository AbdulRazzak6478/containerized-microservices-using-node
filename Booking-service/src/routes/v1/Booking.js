
const express = require('express'); 

const { BookingController } = require('../../controllers');
const { BookingsMiddlewares } = require('../../middlewares');

const router = express.Router();

router.post(
    '/',
    BookingsMiddlewares.validateCreateBookingRequest,
    BookingController.createBooking
)

router.post(
    '/payments',
    BookingsMiddlewares.checkPaymentRequest,
    BookingController.makePayment
)

module.exports = router;