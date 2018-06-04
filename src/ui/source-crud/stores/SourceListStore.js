import { observable, runInAction } from 'mobx';

class SourceListStore {
  @observable sources = [];
  @observable currentPage = 0;
  @observable fetching = false;

  constructor(sourceService, snackBarStore, loaderStore) {
    this.sourceService = sourceService;
    this.snackBarStore = snackBarStore;
    this.loaderStore = loaderStore;
  }
  fetch(complete = true) {
    if (this.sources.length === 0) {
      this.fetching = true;
      this.sourceService.fetch(complete).then((result) => {
        runInAction(() => {
          this.sources = result;
          this.fetching = false;
        });
      }).catch((error) => {
        this.snackBarStore.setMessage(error);
      });
    }
  }
  add = (source) => {
    this.sourceService.add(source).then((response) => {
      const result = {
        id: response.id,
        name: response.name,
        description: response.description,
        command: response.command
      };
      this.sources.push(result);
    }).catch((error) => {
      this.snackBarStore.setMessage(error);
    });
  }
  setCurrentPage = (currentPage) => {
    this.currentPage = currentPage;
  }

  updateElement = (source) => {
    const index = this.sources.findIndex((x) => { return x.id === source.id; });
    runInAction(() => {
      this.sources[index] = source;
    });
  }

}


export default SourceListStore;
