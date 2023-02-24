'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      user_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(128),
        required: true,
        unique: true,
      },
      first_name: {
        type: Sequelize.STRING(128),
        required: true,
      },
      last_name: {
        type: Sequelize.STRING(128),
        required: true,
      },
      password: {
        type: Sequelize.STRING(128),
        required: true,
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
          'users',
          ['user_id'],
          {
            indexName: 'index_user_on_id',
            indicesType: 'UNIQUE',
          }
        )
      ]
    ))
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('users');
  }
};
