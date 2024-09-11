'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'hash', {
      type: Sequelize.STRING,
    })

    queryInterface.addColumn('Users', 'salt', {
      allowNull: false,
      type: Sequelize.STRING,
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'hash', {
      // allowNull: false,
      type: Sequelize.STRING,
    })

    queryInterface.removeColumn('Users', 'salt', {
      // allowNull: false,
      type: Sequelize.STRING,
    })
  }
};
