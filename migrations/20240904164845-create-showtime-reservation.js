'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('reservations', {
      fields: ['showtime_id'],
      type: 'FOREIGN KEY',
      references: {
        table: 'showtimes',
        field: 'showtime_id',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('showtime-reservations');
  }
};