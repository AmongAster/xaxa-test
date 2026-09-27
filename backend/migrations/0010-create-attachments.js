'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attachments', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      stepHistoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'workflow_step_history', key: 'id' },
        onDelete: 'CASCADE',
      },
      fileName: { type: Sequelize.STRING, allowNull: false },
      fileUrl: { type: Sequelize.STRING, allowNull: false },
      mimeType: { type: Sequelize.STRING, allowNull: false },
      size: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('attachments');
  },
};