import { observable, runInAction } from 'mobx';


class SourceFormStore {
  name;
  description;
  command;
  @observable results = [];
  @observable entries = [];
  @observable catalog;
  @observable entry;
  @observable schema = [];
  @observable catalogs = [];
  @observable fetching = false;
  @observable sources = [];
  @observable sourcesEdittingParameter;

  constructor(sourceService, catalogService, categoryService, snackBarStore) {
    this.sourceService = sourceService;
    this.catalogService = catalogService;
    this.categoryService = categoryService;
    this.snackBarStore = snackBarStore;
  }
  setSourcesEdittingParameter = (parameter) => {
    this.sourcesEdittingParameter = parameter;
  }
  fetchEntries = () => {
    this.fetching = true;
    this.categoryService.fetch().then((result) => {
      runInAction(() => {
        this.entries = result;
        this.fetching = false;
      });
    }).catch((error) => {
      this.snackBarStore.setMessage(error);
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
  addSource = (source) => {
    this.fetching = true;
    this.sourceService.add(source).then(() => {
      runInAction(() => {
        this.sources.add(source);
      });
    })
    .catch((error) => {
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
}


export default SourceFormStore;
