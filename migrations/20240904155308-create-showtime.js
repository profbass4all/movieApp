'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('showtimes', {
      sn: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      showtime_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      movie_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      showtime_date:{
        type: Sequelize.DATE,
        allowNull: false,
      },
      is_valid:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('showtimes');
  }
};