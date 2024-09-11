'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.removeColumn('showtimes', 'createdAt', {
      allowNull: true
    })

    queryInterface.removeColumn('showtimes', 'updatedAt', {
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.addColumn('showtimes', 'createdAt', {
      allowNull: false
    })

    queryInterface.addColumn('showtimes', 'updatedAt', {
      allowNull: false
    })
  }
};
