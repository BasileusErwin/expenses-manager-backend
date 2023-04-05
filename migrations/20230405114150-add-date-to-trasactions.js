'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.addColumn('transactions', 'day', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      await queryInterface.addColumn('transactions', 'month', {
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
        allowNull: false,
      }),
      await queryInterface.addColumn('transactions', 'year', {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.removeColumn('transactions', 'day'),
      await queryInterface.removeColumn('transactions', 'month'),
      await queryInterface.removeColumn('transactions', 'year'),
    ]);
  },
};
