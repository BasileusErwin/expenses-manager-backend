'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn('categories', 'user_id', {
      type: Sequelize.UUID,
      references: {
        model: 'users',
        key: 'user_id',
      },
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn('categories', 'user_id');
  },
};
