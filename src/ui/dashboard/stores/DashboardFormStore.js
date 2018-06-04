import { observable } from 'mobx';

class DashboardFormStore {

  @observable dashboardData = {
    name: '',
    description: ''
  };

  constructor(dashboardService, snackBarStore) {
    this.dashboardService = dashboardService;
    this.snackBarStore = snackBarStore;
  }
}

export default DashboardFormStore;
