import { observable, runInAction } from 'mobx';

class DashboardListStore {
  @observable dashboards = [];
  @observable fetching = false;
  @observable currentPage = 0;

  constructor(dashboardService, snackBarStore) {
    this.dashboardService = dashboardService;
    this.snackBarStore = snackBarStore;
  }

  fetch(complete = true) {
    if (this.dashboards.length === 0) {
      this.fetching = true;
      this.dashboardService.fetch(complete)
         .then((result) => {
           runInAction(() => {
             this.dashboards = result;
             this.fetching = false;
           });
         })
         .catch((error) => {
           console.log(error);
           this.snackBarStore.setMessage(error);
         });
    }
  }

  setCurrentPage = (currentPage) => {
    this.currentPage = currentPage;
  }
}

export default DashboardListStore;
