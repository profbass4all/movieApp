'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Revenues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      showtime_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'showtimes',
          key: 'showtime_id',
        }
      },
      number_of_tickets: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_revenue: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Revenues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      showtime_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Showtime',
          key: 'showtime_id',
        }
      },
      number_of_tickets: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_revenue: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  }
};