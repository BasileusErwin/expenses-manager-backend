'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.addColumn('financial_goals', 'month', {
        type: Sequelize.ENUM(),
        values: [
          'JANUARY',
          'FEBRUARY',
          'MARCH',
          'APRIL',
          'MAY',
          'JUNE',
          'JULY',
          'AUGUST',
          'SEPTEMBER',
          'OCTOBER',
          'NOVEMBER',
          'DECEMBER',
        ],
        allowNull: true,
      }),
      await queryInterface.addColumn('financial_goals', 'year', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn('financial_goals', 'month'),
      await queryInterface.removeColumn('financial_goals', 'year')
    ])
  }
};
