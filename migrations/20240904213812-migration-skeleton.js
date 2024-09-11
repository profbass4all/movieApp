'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'created_at', {
      allowNull: true
    })

    queryInterface.removeColumn('Users', 'updated_at', {
      allowNull: true
    })
    
  },

  async down (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'created_at', {
      allowNull: true
    })

    queryInterface.addColumn('Users', 'updated_at', {
      allowNull: true
    })
  }
};
