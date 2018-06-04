import { observable, runInAction } from 'mobx';

class SourceEditStore {
  source;
  @observable id;
  @observable name = '';
  @observable description = '';
  @observable command = '';
  @observable catalog;
  @observable results = [];
  @observable schema = [];
  @observable oldSchema = [];
  @observable parameters = [];
  @observable catalogs = [];
  @observable fetching = false;
  @observable sources = [];
  type = 'sql';

  constructor(sourceService, catalogService, snackBarStore, parameterStore, sourceListStore) {
    this.sourceService = sourceService;
    this.catalogService = catalogService;
    this.snackBarStore = snackBarStore;
    this.parameterStore = parameterStore;
    this.sourceListStore = sourceListStore;
  }

  getSource = (sourceId) => {
    this.fetching = true;
    return new Promise((resolve, reject) => {
      this.sourceService.get(sourceId).then((source) => {
        runInAction(() => {
          this.source = source;
          this.id = source.id;
          this.name = source.name;
          this.description = source.description;
          this.command = source.command;
          this.catalog = source.catalog;
          this.oldSchema = source.schema;
          this.parameters = source.parameters;
          this.fetching = false;
        });
        this.updateParameterStore();
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  }

  updateSource = (source) => {
    return new Promise((resolve, reject) => {
      this.sourceService.update(source).then((response) => {
        this.sourceListStore.updateElement(response);
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  }

  fetchCatalogs = () => {
    this.fetching = true;
    this.catalogService.fetch().then((result) => {
      runInAction(() => {
        this.catalogs = result;
        this.fetching = false;
      });
    }).catch((error) => {
      this.snackBarStore.setMessage(error);
    });
  }

  fetchSources = (onlyWithNoParams = false) => {
    this.fetching = true;
    this.sourceService.fetch(onlyWithNoParams).then((result) => {
      runInAction(() => {
        this.sources = result;
        this.fetching = false;
      });
    }).catch((error) => {
      this.snackBarStore.setMessage(error);
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

  clearSchemaAndResults = () => {
    runInAction(() => {
      this.results = [];
      this.schema = [];
    });
  }

  clearResults = () => {
    this.results = [];
  }

  updateParameterStore() {
    this.parameterStore.loadParameterFromList(this.parameters);
  }

}

export default SourceEditStore;
