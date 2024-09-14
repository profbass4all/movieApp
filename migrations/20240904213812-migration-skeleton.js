'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'created_at', {
      allowNull: true
    })

    await queryInterface.removeColumn('Users', 'updated_at', {
      allowNull: true
    })
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'created_at', {
      allowNull: true
    })

    await queryInterface.addColumn('Users', 'updated_at', {
      allowNull: true
    })
  }
};
