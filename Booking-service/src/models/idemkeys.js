'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class idemKeys extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  idemKeys.init({
    value:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
    },
    userId: DataTypes.INTEGER,
    bookingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'idemKeys',
  });
  return idemKeys;
};