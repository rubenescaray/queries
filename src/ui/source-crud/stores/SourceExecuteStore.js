import { observable, runInAction } from 'mobx';


class SourceExecuteStore {
  @observable source = null;
  @observable results = [];
  @observable schema = [];
  @observable fetching = false;

  constructor(sourceService, snackBarStore, loaderStore) {
    this.sourceService = sourceService;
    this.snackBarStore = snackBarStore;
    this.loaderStore = loaderStore;
  }
  getSourceWithPromise = (sourceId) => {
    this.loaderStore.start();
    return new Promise((resolve, reject) => {
      this.sourceService.get(sourceId).then((result) => {
        this.source = result;
        this.loaderStore.end();
        resolve(result);
      }).catch((error) => {
        this.snackBarStore.setMessage(error);
        this.loaderStore.end();
        reject();
      });
    });
  }
  testSource = (source) => {
    runInAction(() => {
      this.fetching = true;
      this.schema = [];
      this.results = [];
    });
    this.sourceService.test(source).then((result) => {
      runInAction(() => {
        this.schema = result.schema;
        this.results = result.result;
        this.fetching = false;
      });
    }).catch((error) => {
      this.snackBarStore.setMessage(error);
    });
  }
}


export default SourceExecuteStore;
