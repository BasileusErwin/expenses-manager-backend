'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.addColumn('transactions', 'goal_id', {
      type: Sequelize.UUID,
      references: {
        model: 'financial_goals',
        key: 'goal_id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.renameTable('transactions', 'goal_id');
  },
};
