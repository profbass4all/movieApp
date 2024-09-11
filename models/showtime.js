'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class showtime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      showtime.hasMany(models.reservation);
      models.reservation.belongsTo(showtime, {
        foreignKey:'showtime_id'
      })

      // models.movie.hasMany(showtime);
      // showtime.belongsTo(models.movie, {
      //   foreignKey:'movie_id'
      // })

    }
  }
  showtime.init({
    sn: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER
      },
      showtime_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      movie_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      showtime_date:{
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_valid:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      showtime_capacity:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 100, // default seat capacity is 100
      },
      seats_available:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 100, // default seats available is 100
      }
  }, {
    sequelize,
    modelName: 'showtime', 
  });
  return showtime;
};