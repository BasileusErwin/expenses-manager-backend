'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable('transactions', {
      transaction_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'user_id',
        },
        allowNull: false,
      },
      category_id: {
        type: Sequelize.UUID,
        references: {
          model: 'categories',
          key: 'category_id',
        },
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM(),
        values: ['INCOME', 'EXPENSE'],
        allowNull: false,
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      currency: {
        type: Sequelize.ENUM(),
        values: ['USD', 'UYU', 'EUR'],
        defaultValue: 'USD',
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
      },
      note: {
        type: Sequelize.TEXT
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        defaultValue: null,
      },
    }).then(() => (
      [
        queryInterface.addIndex(
          'transactions',
          ['transaction_id'],
          {
            indexName: 'index_transaction_on_id',
            indicesType: 'UNIQUE',
          }
        )
      ]
    ))
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('transactions');
  }
};
