'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('audit_logs', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
      },
      action: { type: Sequelize.ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN'), allowNull: false },
      entityType: { type: Sequelize.STRING, allowNull: false },
      entityId: { type: Sequelize.STRING, allowNull: true },
      ipAddress: { type: Sequelize.STRING, allowNull: true },
      userAgent: { type: Sequelize.STRING, allowNull: true },
      payload: { type: Sequelize.JSONB, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('audit_logs');
  },
};