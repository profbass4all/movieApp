'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'hash', {
      type: Sequelize.STRING,
    })

    await queryInterface.addColumn('Users', 'salt', {
      allowNull: false,
      type: Sequelize.STRING,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'hash', {
      // allowNull: false,
      type: Sequelize.STRING,
    })

    await queryInterface.removeColumn('Users', 'salt', {
      // allowNull: false,
      type: Sequelize.STRING,
    })
  }
};
