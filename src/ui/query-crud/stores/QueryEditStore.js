import { observable, runInAction, toJS } from 'mobx';

class QueryEditStore {
  query;
  @observable queries = [];
  @observable linkedQueryId;
  @observable linkedQueryParametersMap = [];
  @observable selectedLinkedQuery = { id: '', parameters: [] };
  @observable name = '';
  @observable description = '';
  @observable entry = { name: '' };
  @observable category;
  @observable isSingleQuery = false;
  @observable source = {};
  @observable sourceId = '';
  @observable sources = [];
  @observable results = [];
  @observable expandedRows = {};
  @observable schema = [];
  @observable fetching = false;
  @observable isModalOpen = false;
  @observable isModalGroupingsOpen = false;
  @observable isModalSummarizationOpen = false;

  constructor(sourceService, queryService, categoryStore, snackBarStore, loaderStore) {
    this.sourceService = sourceService;
    this.queryService = queryService;
    this.categoryStore = categoryStore;
    this.snackBarStore = snackBarStore;
    this.loaderStore = loaderStore;
  }

  fetchSources = () => {
    this.fetching = true;
    this.sourceService.fetch().then((result) => {
      runInAction(() => {
        this.sources = result;
        this.fetching = false;
      });
    }).catch((error) => {
      this.snackBarStore.setMessage(error);
    });
  }

  fetchQueries = (queryId) => {
    return new Promise((resolve, reject) => {
      this.queryService.fetchLinkableQueries().then((result) => {
        runInAction(() => {
          this.queries = result;
          if (queryId) {
            this.selectedLinkedQuery = result.find((x) => { return x.id === queryId; });
          }
        });
        resolve();
      }).catch((error) => {
        //this.snackBarStore.setMessage();
        reject(error);
      });
    });
  }

  setLinkedQuery = (query) => {
    const linkedQuery = toJS(query);
    runInAction(() => {
      this.selectedLinkedQuery = linkedQuery[0];
    });
  }

  updateLinkedQueryParametersMap = (mappedParams) => {
    this.linkedQueryParametersMap = mappedParams;
  }

  getQuery = (queryId) => {
    this.fetching = true;
    this.loaderStore.start();
    return new Promise((resolve, reject) => {
      this.queryService.get(queryId).then((query) => {
        runInAction(() => {
          this.query = query;
          this.name = query.name;
          this.isSingleQuery = query.isSingleQuery;
          this.entry = query.category ? this.categoryStore.getEntryById(query.category.entryId) : undefined;
          this.category = query.category ? this.categoryStore.getCategoryById(query.category.id) : undefined;
          this.description = query.description;
          this.source = query.source;
          this.schema = query.source.schema;
          this.fetching = false;
          this.linkedQueryId = query.linkedQueryId;
          if (query.linkedQueryParametersMap) {
            query.linkedQueryParametersMap.forEach((paramMap) => { this.linkedQueryParametersMap.push(paramMap); });
          }
          this.loaderStore.end();
        });
        resolve();
      }).catch((error) => {
        this.loaderStore.end();
        reject(error);
      });
    });
  }

  findSourceByIndex = (index) => {
    const source = this.sources[index];
    return source;
  }

  testQuery = (query) => {
    runInAction(() => {
      this.fetching = true;
      this.schema = [];
      this.results = [];
    });
    this.queryService.test(query).then((result) => {
      runInAction(() => {
        this.schema = result.schema;
        this.results = result.result;
        this.fetching = false;
      });
    }).catch((error) => {
      this.snackBarStore.setMessage(error);
    });
  }

  updateQuery = (query) => {
    return this.queryService.update(query);
  }

  setExpandedRows = (newExpanded) => {
    this.expandedRows = Object.assign({}, this.expandedRows, newExpanded);
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

  toggleModal = (value) => {
    runInAction(() => {
      this.isModalOpen = value;
    });
  }

  toggleModalGroupings = (value) => {
    runInAction(() => {
      this.isModalGroupingsOpen = value;
    });
  }

  toggleModalSummarization = (value) => {
    runInAction(() => {
      this.isModalSummarizationOpen = value;
    });
  }
}

export default QueryEditStore;
