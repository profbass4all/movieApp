'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('showtimes', {
      fields:['movie_id'],
      type: 'FOREIGN KEY',
      references: {
        table: 'movies',
        field: 'movie_id',
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('showtimes', {
      fields:['movie_id'],
      type: 'FOREIGN KEY',
      references: {
        table: 'movies',
        field: 'movie_id',
      }
    });
  }
};