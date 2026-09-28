'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workflow_instances', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      templateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'workflow_templates', key: 'id' },
        onDelete: 'RESTRICT',
      },
      universityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'universities', key: 'id' },
        onDelete: 'CASCADE',
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'it_products', key: 'id' },
        onDelete: 'CASCADE',
      },
      currentStepIndex: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'COMPLETED', 'PAUSED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('workflow_instances');
  },
};