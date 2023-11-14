const express = require('express');

const { AirportController } = require('../../controllers');
const { AirportMiddlewares } = require('../../middlewares');
const router = express.Router();


// /api/v1/airports POST
router.post('/',AirportMiddlewares.validateCreateRequest,AirportController.createAirport);
// router.post('/',AirportController.createAirport);

// /api/v1/airports GET_ALL
router.get('/',AirportController.getAirports);

// /api/v1/airports/:id GET Airport by id
router.get('/:id',AirportController.getAirport);

// /api/v1/airports/:id => delete Airport by id
router.delete('/:id',AirportController.destroyAirport);

// /api/v1/airports/:id => delete Airport by id
router.put('/:id',AirportController.updateAirport);
router.patch('/:id',AirportController.updateAirport);


module.exports = router;