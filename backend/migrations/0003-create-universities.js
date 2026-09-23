'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('universities', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      vendor: { type: Sequelize.STRING, allowNull: true },
      software: { type: Sequelize.STRING, allowNull: true },
      contractNumber: { type: Sequelize.STRING, allowNull: true },
      licenseSigningDate: { type: Sequelize.DATEONLY, allowNull: true },
      licenseValidUntilYear: { type: Sequelize.INTEGER, allowNull: true },
      transferStatus: {
        type: Sequelize.ENUM('PLANNED', 'IN_PROGRESS', 'DONE', 'ON_HOLD'),
        allowNull: false,
        defaultValue: 'PLANNED',
      },
      managerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'RESTRICT',
      },
      universityContacts: { type: Sequelize.JSONB, allowNull: true, defaultValue: [] },
      comment: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('universities');
  },
};