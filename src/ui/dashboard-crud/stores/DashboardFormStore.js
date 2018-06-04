import { observable } from 'mobx';
import Utils from '../../../utils';

class DashboardFormStore {

  dashboardName;
  dashboardDescription;
  @observable isOpenDrawer = true;

  constructor(dashboardService, widgetContainerStore, snackBarStore) {
    this.dashboardService = dashboardService;
    this.widgetContainerStore = widgetContainerStore;
    this.snackBarStore = snackBarStore;

    if (Utils.screenWidth() < 600) {
      this.isOpenDrawer = false;
    }
  }

}

export default DashboardFormStore;
