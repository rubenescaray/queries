import { observable, runInAction } from 'mobx';
import Utils from '../../../utils';

class DashboardEditStore {

  @observable fetching = false;
  @observable dashboard = {};

  dashboardId;
  @observable dashboardName = '';
  @observable dashboardDescription = '';
  @observable isOpenDrawer = true;

  constructor(dashboardService, widgetContainerStore, snackBarStore) {
    this.dashboardService = dashboardService;
    this.widgetContainerStore = widgetContainerStore;
    this.snackBarStore = snackBarStore;

    if (Utils.screenWidth() < 600) {
      this.isOpenDrawer = false;
    }
  }

  get = (dashboardId) => {
    this.fetching = true;
    this.dashboardService.get(dashboardId)
      .then((result) => {
        runInAction(() => {
          this.dashboard = result;
          this.fetching = false;
          this.setWidgetsForRendering(this.dashboard.widgets);
          this.setDataDashboard(this.dashboard);
        });
      })
      .catch((error) => {
        this.snackBarStore.setMessage(error);
      });
  }

  setWidgetsForRendering = (widgetList) => {
    this.widgetContainerStore.setWidgetsForRendering(widgetList);
  };

  setDataDashboard = (dashboard) => {
    this.dashboardId = dashboard.id;
    this.dashboardName = dashboard.name;
    this.dashboardDescription = dashboard.description;
  };

  updateDashboard = (dashboard) => {
    return this.dashboardService.update(dashboard);
  }

}

export default DashboardEditStore;
