import { observable, runInAction, toJS } from 'mobx';

class QueryFormStore {
  name;
  description;
  @observable entry;
  @observable category;
  @observable isSingleQuery = false;
  @observable source = null;
  @observable sources = [];
  @observable results = [];
  @observable schema = [];
  @observable queries = [];
  @observable queriesFetched = false;
  @observable selectedLinkedQuery = { id: '', parameters: [] };
  @observable linkedQueryParametersMap = [];
  @observable expandedRows = {};
  @observable fetching = false;
  @observable isModalOpen = false;
  @observable isModalGroupingsOpen = false;
  @observable isModalSummarizationOpen = false;

  constructor(sourceService, queryService, categoryStore, snackBarStore) {
    this.sourceService = sourceService;
    this.queryService = queryService;
    this.categoryStore = categoryStore;
    this.snackBarStore = snackBarStore;
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

  fetchQueries = () => {
    this.queryService.fetchLinkableQueries().then((result) => {
      runInAction(() => {
        this.queries = result;
        this.queriesFetched = true;
        this.isModalOpen = true;
      });
    }).catch((error) => {
      this.snackBarStore.setMessage(error);
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

export default QueryFormStore;
