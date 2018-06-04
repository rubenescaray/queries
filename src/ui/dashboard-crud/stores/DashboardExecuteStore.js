import { observable, runInAction } from 'mobx';

class DashboardExecuteStore {

  @observable fetching = false;
  @observable dashboard = {};

  constructor(dashboardService, widgetContainerStore, snackBarStore) {
    this.dashboardService = dashboardService;
    this.widgetContainerStore = widgetContainerStore;
    this.snackBarStore = snackBarStore;
  }

  get = (dashboardId) => {
    this.fetching = true;
    this.dashboardService.get(dashboardId)
      .then((result) => {
        runInAction(() => {
          this.dashboard = result;
          this.fetching = false;
          this.setWidgetsForRendering(this.dashboard.widgets);
        });
      })
      .catch((error) => {
        console.log(error);
        this.snackBarStore.setMessage(error);
      });
  }

  setWidgetsForRendering = (widgetList) => {
    this.widgetContainerStore.setWidgetsForRendering(widgetList);
  }

}

export default DashboardExecuteStore;
