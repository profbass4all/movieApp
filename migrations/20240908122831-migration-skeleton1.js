'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('showtimes', 'showtime_capacity', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('showtimes', 'showtime_capacity', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  }
};
