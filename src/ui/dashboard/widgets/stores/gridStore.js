import { observable, runInAction } from 'mobx';

export default class GridStore {
    @observable queryId = '';
    @observable queryName = '';
    @observable queryDescription = '';
    @observable query = undefined;
    @observable source = undefined;
    @observable parameters = [];
    @observable results = [];
    @observable schema = [];
    @observable selects = [];
    @observable criteriaFilter = [];
    @observable group = [];
    @observable sorts = [];
    @observable summary = [];
    @observable fetching = false;
    @observable expandedRows = {};

  constructor(queryService, snackBarStore) {
    this.queryService = queryService;
    this.snackBarStore = snackBarStore;
  }

  executeQueryById = (queryId) => {
    return new Promise((resolve, reject) => {
      runInAction(() => {
        this.fetching = true;
        this.queryName = '';
        this.queryDescription = '';
        this.schema = [];
        this.parameters = [];
        this.results = [];
        this.selects = [];
        this.criteriaFilter = [];
        this.group = [];
        this.sorts = [];
        this.summary = [];
      });
      this.fetching = true;
      this.queryService.executeById(queryId)
        .then((executionResult) => {
          runInAction(() => {
            this.queryId = queryId;
            this.queryName = executionResult.queryName;
            this.source = executionResult.source;
            this.queryDescription = executionResult.queryDescription;
            this.schema = executionResult.schema;
            this.results = executionResult.result;
            this.selects = executionResult.selects;
            this.parameters = executionResult.parameters;
            this.criteriaFilter = executionResult.criteriaFilter;
            this.group = executionResult.group;
            this.sorts = executionResult.sorts;
            this.summary = executionResult.summary;
            this.fetching = false;
          });
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
