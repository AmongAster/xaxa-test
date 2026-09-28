'use strict';
// Индексы на часто фильтруемые поля - п.4 ТЗ (НФТ: отклик < 1 сек)
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('universities', ['managerId']);
    await queryInterface.addIndex('universities', ['transferStatus']);
    await queryInterface.addIndex('it_products', ['universityId']);
    await queryInterface.addIndex('workflow_instances', ['universityId']);
    await queryInterface.addIndex('workflow_instances', ['status']);
    await queryInterface.addIndex('workflow_step_history', ['instanceId']);
    await queryInterface.addIndex('audit_logs', ['userId']);
    await queryInterface.addIndex('audit_logs', ['entityType']);
  },
  async down(queryInterface) {
    await queryInterface.removeIndex('universities', ['managerId']);
    await queryInterface.removeIndex('universities', ['transferStatus']);
    await queryInterface.removeIndex('it_products', ['universityId']);
    await queryInterface.removeIndex('workflow_instances', ['universityId']);
    await queryInterface.removeIndex('workflow_instances', ['status']);
    await queryInterface.removeIndex('workflow_step_history', ['instanceId']);
    await queryInterface.removeIndex('audit_logs', ['userId']);
    await queryInterface.removeIndex('audit_logs', ['entityType']);
  },
};