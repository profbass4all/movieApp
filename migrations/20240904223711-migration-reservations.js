'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('reservations', 'createdAt', {
      allowNull: true
    })

    await queryInterface.removeColumn('reservations', 'updatedAt', {
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.addColumn('reservations', 'createdAt', {
      allowNull: true
    })

    await queryInterface.addColumn('reservations', 'updatedAt', {
      allowNull: true
    })
  }
};
