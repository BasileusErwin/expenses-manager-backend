'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.renameColumn('categories', 'value', 'name');
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.renameColumn('categories', 'name', 'value');
  }
};
