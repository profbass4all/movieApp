'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('showtimes', {
      fields: ['movie_id'],
      type: 'foreign key',
      name: 'movie_showtime_association',
      references: {
        table: 'movies',
        field: 'movie_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('showtimes', {
      fields: ['movie_id'],
      type: 'foreign key',
      name: 'movie_showtime_association',
      references: {
        table: 'movies',
        field: 'movie_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  }
};
