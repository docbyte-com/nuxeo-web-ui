import BasePage from '../base';
import Vocabulary from './admin/vocabulary';
import CloudServices from './admin/cloudServices';
import { url } from '../helpers';

export default class ArchiveManagement extends BasePage {
  get bulkPluginExecution() {
    return this.el.element('bulkPluginExecution');
  }
  get bulkActionsOverview() {
    return this.el.element('bulkActionsOverview');
  }
}
