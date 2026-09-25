'use strict';
// Роли из таблицы roles нигде не создавались - до этой миграции таблица
// была пустой. Без этих трёх строк ни ручное назначение роли, ни
// авто-провижининг юзеров из Keycloak (UsersService.findOrCreateFromKeycloak)
// не могли работать - буквально не на что было сослаться по roleId.
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('roles', [
      { name: 'USER', description: 'КАМ / менеджер, видит только свои ВУЗы', createdAt: now, updatedAt: now },
      { name: 'MANAGER', description: 'Руководитель, видит ВУЗы своих подчинённых', createdAt: now, updatedAt: now },
      { name: 'ADMIN', description: 'Администратор, видит всё', createdAt: now, updatedAt: now },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', { name: ['USER', 'MANAGER', 'ADMIN'] });
  },
};