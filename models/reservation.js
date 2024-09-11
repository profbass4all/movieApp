'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      reservation.belongsTo(models.User, {
        foreignKey: 'user_id'
      })
      models.User.hasMany(reservation)
    }
  }
  reservation.init({
    sn: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER
      },
      reservation_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      showtime_id:{
        type: DataTypes.UUID,
        allowNull: false,
      },
      user_id:{
        type: DataTypes.UUID,
        allowNull: false,
      },
      seat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      
  }, {
    sequelize,
    modelName: 'reservation',
    timestamps: false,
  });
  return reservation;
};