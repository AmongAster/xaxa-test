'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('it_products', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      directionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'it_directions', key: 'id' },
        onDelete: 'RESTRICT',
      },
      universityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'universities', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('it_products');
  },
};