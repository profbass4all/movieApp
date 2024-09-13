'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Revenue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Revenue.init({
      showtime_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Model.showtime,
          key: 'showtime_id',
        }
      },
      number_of_tickets: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_revenue: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      }
    
  }, {
    sequelize,
    modelName: 'Revenue',
  });
  return Revenue;
};