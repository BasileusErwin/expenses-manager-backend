'use strict';

const replaceEnum = require('sequelize-replace-enum-postgres').default;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await replaceEnum({
      queryInterface,
      tableName: 'transactions',
      columnName: 'type',
      newValues: ['INCOME', 'EXPENSE', 'SAVING', 'INSTALLMENTS'],
    });

    await replaceEnum({
      queryInterface,
      tableName: 'categories',
      columnName: 'type',
      newValues: ['INCOME', 'EXPENSE', 'SAVING', 'INSTALLMENTS'],
    });
  },

  async down(queryInterface, Sequelize) {
    await replaceEnum({
      queryInterface,
      tableName: 'transactions',
      columnName: 'type',
      newValues: ['INCOME', 'EXPENSE'],
    });
    await replaceEnum({
      queryInterface,
      tableName: 'categories',
      columnName: 'type',
      newValues: ['INCOME', 'EXPENSE'],
    });
  },
};
