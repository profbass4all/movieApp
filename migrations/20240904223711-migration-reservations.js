'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.removeColumn('reservations', 'createdAt', {
      allowNull: true
    })

    queryInterface.removeColumn('reservations', 'updatedAt', {
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
   queryInterface.addColumn('reservations', 'createdAt', {
      allowNull: true
    })

    queryInterface.addColumn('reservations', 'updatedAt', {
      allowNull: true
    })
  }
};
