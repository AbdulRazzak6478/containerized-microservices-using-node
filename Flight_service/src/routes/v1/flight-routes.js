const express = require("express");

const { FlightController } = require("../../controllers");
const { FlightMiddlewares } = require("../../middlewares");
const router = express.Router();

// /api/v1/flights POST

router.post(
  "/",
  FlightMiddlewares.validateCreateRequest,
  FlightMiddlewares.checkRequestParameters,
  FlightController.createFlight
);

// /api/v1/flights?trips=MUM-DEL query_params GET_ALL
router.get("/", FlightController.getAllFlights);

// /api/v1/flights/:id GET Flight by id
router.get("/:id", FlightController.getFlight);

// /api/v1/flights/:id/seats
router.patch(
  "/:id/seats",
  FlightMiddlewares.validateUpdateSeatsRequest,
  FlightController.updateSeats
);

module.exports = router;
