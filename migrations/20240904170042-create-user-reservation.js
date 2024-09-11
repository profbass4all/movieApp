'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('reservations', {
      fields: ['user_id'],
      type: 'FOREIGN KEY',
      references: {
        table: 'Users',
        field: 'user_id',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user-reservations');
  }
};