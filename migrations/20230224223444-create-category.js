'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface
      .createTable('categories', {
        category_id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        type: {
          type: Sequelize.ENUM(),
          values: ['INCOME', 'EXPENSE'],
          allowNull: false,
        },
        value: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        note: {
          type: Sequelize.TEXT,
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
      })
      .then(() => [
        queryInterface.addIndex('categories', ['category_id'], {
          indexName: 'index_category_on_id',
          indicesType: 'UNIQUE',
        }),
      ]);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('categories');
  },
};
