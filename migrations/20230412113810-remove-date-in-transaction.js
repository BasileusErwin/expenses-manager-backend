'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.removeColumn('transactions', 'date');
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.addColumn('transactions', 'date', {
      type: Sequelize.DATE,
    });
  },
};
