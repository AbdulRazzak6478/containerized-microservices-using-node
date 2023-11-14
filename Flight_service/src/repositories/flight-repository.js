const CrudRepository = require("./crud-repository");
const { Flight, Airplane, Airport, City } = require("../models");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const { Sequelize } = require("sequelize");
const db = require("../models");
const { addRowLockFlights } = require("./queries");

class FlightRepository extends CrudRepository {
  constructor() {
    super(Flight);
  }

  async getAllFlights(filter, sort) {
    const response = await this.model.findAll({
      where: filter,
      order: sort,
      //using eager loading :  querying data of several model at once
      include: [
        {
          // custom join in already in primary key
          model: Airplane,
          required: true,
          as: "airplaneDetail",
        },
        {
          // custom join in diff attributes
          model: Airport,
          required: true,
          as: "departureAirport", // Note : make sure to give alias at the place of association also and use alias name to check
          // to associate with multiple columns in model
          on: {
            col1: Sequelize.where(
              Sequelize.col("Flight.departureAirportId"),
              "=",
              Sequelize.col("departureAirport.code")
            ),
          },
          include: {
            model: City,
            required: true,
          },
        },
        {
          model: Airport,
          required: true,
          as: "arrivalAirport", // Note : make sure to give alias at the place of association also use alias name to check
          // to associate with multiple columns in model
          on: {
            col1: Sequelize.where(
              Sequelize.col("Flight.arrivalAirportId"),
              "=",
              Sequelize.col("arrivalAirport.code")
            ),
          },
          // nested join can be done
          include: {
            model: City,
            required: true,
          },
        },
      ],
    });
    // return response;
    console.log(response.length);

    if (response.length == 0) {
      throw new AppError(
        "Not able to found the flight of these filters",
        StatusCodes.NOT_FOUND
      );
    }
    return response;
  }

  async getBookedFlight(id) {
    const flight = await this.model.findByPk(id, {
      include: [
        {
          // custom join in already in primary key
          model: Airplane,
          required: true,
          as: "airplaneDetail",
        },
        {
          // custom join in diff attributes
          model: Airport,
          required: true,
          as: "departureAirport", // Note : make sure to give alias at the place of association also and use alias name to check
          // to associate with multiple columns in model
          on: {
            col1: Sequelize.where(
              Sequelize.col("Flight.departureAirportId"),
              "=",
              Sequelize.col("departureAirport.code")
            ),
          },
          include: {
            model: City,
            required: true,
          },
        },
        {
          model: Airport,
          required: true,
          as: "arrivalAirport", // Note : make sure to give alias at the place of association also use alias name to check
          // to associate with multiple columns in model
          on: {
            col1: Sequelize.where(
              Sequelize.col("Flight.arrivalAirportId"),
              "=",
              Sequelize.col("arrivalAirport.code")
            ),
          },
          // nested join can be done
          include: {
            model: City,
            required: true,
          },
        },
      ],
    });
    if (flight.length == 0) {
      throw new AppError(
        "Not able to found the flight of these filters",
        StatusCodes.NOT_FOUND
      );
    }
    return flight;
  }

  async updateRemainingSeats(id, seats, dec = true) {
    const transaction = await db.sequelize.transaction();
    try {
      await db.sequelize.query(addRowLockFlights(id));
      // get old data but updated in the db
      const flight = await Flight.findByPk(id);
      // console.log("dec ",dec,typeof dec);
      dec = +dec;
      // console.log(parseInt(dec)); // NaN
      if (dec) {
        console.log("inside decrement");
        const response = await flight.decrement(
          "totalSeats",
          { by: seats },
          { transaction: transaction }
        );
      } else {
        console.log("inside increment");
        const response = await flight.increment(
          "totalSeats",
          { by: seats },
          { transaction: transaction }
        );
      }
      await transaction.commit();
      return await Flight.findByPk(id);
      // return await this.getBookedFlight(id);
      // return flight;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = FlightRepository;
