import { observable, runInAction } from 'mobx';

class DashboardListStore {
  @observable dashboards = [];
  @observable fetching = false;
  @observable currentPage = 0;
  @observable dataForList = [];

  constructor(dashboardService, snackBarStore) {
    this.dashboardService = dashboardService;
    this.snackBarStore = snackBarStore;
  }

  fetch(complete = true) {
    if (this.dashboards.length === 0) {
      this.fetching = true;
      this.dashboardService.fetch(complete)
         .then((result) => {
           //console.log('RESULT LIST', result);
           runInAction(() => {
             this.dashboards = result;
             this.fetching = false;
           });
           this.setDataForDashboardList(result);
         })
         .catch((error) => {
           console.log(error);
           this.snackBarStore.setMessage(error);
         });
    }
  }

  setDataForDashboardList = (data) => {
    data.forEach((dashboard) => {
      let widgetNames = '';
      dashboard.widgets.forEach((widget) => {
        widgetNames += `${widget.title}, `;
      });
      widgetNames = widgetNames.substring(0, widgetNames.length - 2);
      this.dataForList.push({
        id: dashboard.id,
        name: dashboard.name,
        description: dashboard.description,
        widgetNames
      });
    });
  };

  add = (query) => {
    this.dashboardService.add(query)
    .then((response) => {
      const resultArr = [];
      const result = {
        id: response.id,
        name: response.name,
        description: response.description,
        widgets: response.widgets
      };
      runInAction(() => {
        this.dashboards.push(result);
        resultArr.push(response);
        this.setDataForDashboardList(resultArr);
      });
    }).catch((error) => {
      this.snackBarStore.setMessage(error);
    });
  }

  setCurrentPage = (currentPage) => {
    this.currentPage = currentPage;
  }
}

export default DashboardListStore;
