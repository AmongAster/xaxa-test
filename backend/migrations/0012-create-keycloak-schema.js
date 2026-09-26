'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Создаем схему для Keycloak, если её еще нет
    await queryInterface.createSchema('keycloak');
  },

  async down(queryInterface, Sequelize) {
    // На случай отката миграций
    await queryInterface.dropSchema('keycloak');
  }
};
