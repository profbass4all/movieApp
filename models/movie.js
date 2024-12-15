const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Example:
      // movie.belongsTo(models.Author, { foreignKey: 'authorId' });
      movie.hasMany(models.showtime);
      models.showtime.belongsTo(movie, {
        foreignKey:'movie_id'
      })
    }
  }
  movie.init({
    sn: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER
      },
      movie_id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: false
      },
      poster_image:{
        type: DataTypes.STRING,
        allowNull: false  
      },
  }, {
    sequelize,
    modelName: 'movie',
  });
  return movie;
};