'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('showtimes', 'createdAt', {
      allowNull: true
    })

    await queryInterface.removeColumn('showtimes', 'updatedAt', {
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('showtimes', 'createdAt', {
      allowNull: false
    })

    await queryInterface.addColumn('showtimes', 'updatedAt', {
      allowNull: false
    })
  }
};
