import BasePage from '../base';

export default class ArchiveManagement extends BasePage {
  get bulkPluginExecution() {
    return this.el.element('bulkPluginExecution');
  }

  get bulkActionsOverview() {
    return this.el.element('bulkActionsOverview');
  }
}
