'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workflow_step_history', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      instanceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'workflow_instances', key: 'id' },
        onDelete: 'CASCADE',
      },
      stepName: { type: Sequelize.STRING, allowNull: false },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'RESTRICT',
      },
      comment: { type: Sequelize.TEXT, allowNull: true },
      changedAt: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('workflow_step_history');
  },
};