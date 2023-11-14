"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Airplane, {
        foreignKey: "airplaneId",
        as:'airplaneDetail'
      });
      this.belongsTo(models.Airport, {
        foreignKey: "departureAirportId",
        as:'departureAirport'
      });
      this.belongsTo(models.Airport, {
        foreignKey: "arrivalAirportId",
        as:'arrivalAirport'
      });
      // this.hasMany(models.Airport, {
      //   // foreignKey: ['departureAirportId','arrivalAirportId'],
      //   foreignKey: 'departureAirportId',
      //   onDelete:'CASCADE'
      // });
      // this.hasMany(models.Airport, {
      //   // foreignKey: ['departureAirportId','arrivalAirportId'],
      //   foreignKey: 'arrivalAirportId',
      //   onDelete:'CASCADE'
      // });
      // this.hasMany(models.Airplane, {
      //   // foreignKey: ['departureAirportId','arrivalAirportId'],
      //   foreignKey: 'airplaneId',
      //   onDelete:'CASCADE'
      // });
    }
  }
  Flight.init(
    {
      flightNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      airplaneId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      departureAirportId: {
        type: DataTypes.STRING,
        allowNull: false,
      }, 
      arrivalAirportId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      arrivalTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      departureTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      boardingGate: {
        type: DataTypes.STRING,
      },
      totalSeats: { //total remaining seats
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Flight",
    }
  );
  return Flight;
};
