import { observable, runInAction } from 'mobx';

class QueryExecuteStore {

  csvSpetialCharactersRegExp = '[,",\n]';

    @observable queryId = '';
    @observable queryName = '';
    @observable queryDescription = '';
    @observable entry = { name: '' };
    @observable category = { name: '' };
    @observable isSingleQuery = false;
    @observable query = undefined;
    @observable source = undefined;
    @observable parameters = [];
    @observable linkedQueryId = '';
    @observable linkedQueryParametersMap = [];
    @observable results = [];
    @observable csvResults = '';
    @observable schema = [];
    @observable selects = [];
    @observable criteriaFilter = [];
    @observable group = [];
    @observable allowExpand = false;
    @observable sorts = [];
    @observable summary = [];
    @observable fetching = false;
    @observable expandedRows = {};
    @observable showShareDialog = false;
    @observable urlCopied = false;

  constructor(queryService, snackBarStore, categoryStore, loaderStore) {
    this.queryService = queryService;
    this.snackBarStore = snackBarStore;
    this.categoryStore = categoryStore;
    this.loaderStore = loaderStore;
  }

  getQuery = (queryId) => {
    return new Promise((resolve, reject) => {
      runInAction(() => {
        this.query = null;
        this.fetching = true;
        this.loaderStore.start();
      });
      this.queryService.get(queryId)
        .then((query) => {
          runInAction(() => {
            this.query = query;
            this.queryId = query.id;
            this.source = query.source;
            this.schema = query.source.schema;
            this.queryName = query.name;
            this.entry = query.category ? this.categoryStore.getEntryById(query.category.entryId) : { name: '' };
            this.category = query.category ? this.categoryStore.getCategoryById(query.category.id) : { name: '' };
            this.isSingleQuery = query.isSingleQuery;
            this.queryDescription = query.description;
            this.parameters = query.parameters;
            this.selects = query.selects;
            this.criteriaFilter = query.criteriaFilter;
            this.group = query.group;
            this.allowExpand = query.group.allowExpand;
            this.summary = query.summary;
            this.linkedQueryId = query.linkedQueryId;
            this.linkedQueryParametersMap = query.linkedQueryParametersMap;
            this.fetching = false;
            this.loaderStore.end();
          });
          //console.log('category: ', this.category);
          //console.log('entry: ', this.entry);
          resolve();
        })
        .catch((error) => {
          this.loaderStore.end();
          reject(error);
        });
    });
  }

  executeQueryById = (queryId) => {
    return new Promise((resolve, reject) => {
      runInAction(() => {
        this.fetching = true;
        this.loaderStore.start();
      });
      this.queryService.executeById(queryId)
        .then((executionResult) => {
          runInAction(() => {
            this.queryId = queryId;
            this.queryName = executionResult.queryName;
            this.entry = executionResult.category ? this.categoryStore.getEntryById(executionResult.category.entryId) : { name: '' };
            this.category = executionResult.category ? this.categoryStore.getCategoryById(executionResult.category.id) : undefined;
            this.source = executionResult.source;
            this.isSingleQuery = executionResult.isSingleQuery;
            this.queryDescription = executionResult.queryDescription;
            this.schema = executionResult.schema;
            this.results = executionResult.result;
            this.selects = executionResult.selects;
            this.parameters = executionResult.parameters;
            this.criteriaFilter = executionResult.criteriaFilter;
            this.group = executionResult.group;
            this.allowExpand = executionResult.group.allowExpand !== undefined ? executionResult.group.allowExpand : true;
            this.sorts = executionResult.sorts;
            this.summary = executionResult.summary;
            this.linkedQueryId = executionResult.linkedQueryId;
            this.linkedQueryParametersMap = executionResult.linkedQueryParametersMap;
            this.fetching = false;
            this.loaderStore.end();
          });
          resolve();
        })
        .catch((error) => {
          this.loaderStore.end();
          reject(error);
        });
    });
  }

  executeQuery = (query) => {
    runInAction(() => {
      this.fetching = true;
      this.schema = [];
      this.results = [];
    });
    this.queryService.execute(query)
        .then((result) => {
          runInAction(() => {
            this.schema = result.schema;
            this.results = result.result;
            this.fetching = false;
          });
        }).catch((error) => {
          this.snackBarStore.setMessage(error);
        });
  }

  exportToCSV = () => {
    if (!this.fetching) {
      if (this.schema && this.schema.length > 0 && this.results && this.results.length > 0) {
        const regExp = new RegExp(this.csvSpetialCharactersRegExp);
        const csvResults = [];
        this.results.forEach((record) => {
          const recordFields = [];
          this.schema.forEach((field) => {
            if (regExp.test(record[field.name])) {
              recordFields.push(`"${record[field.name]}"`);
            } else {
              recordFields.push(record[field.name]);
            }
          });
          csvResults.push(recordFields.join(','));
        });

        const blob = new Blob([csvResults.join('\r\n')], { type: 'text/csv' }); // pass a useful mime type here
        const url = URL.createObjectURL(blob);
        const element = document.createElement('a');
        element.href = url;
        element.download = `${this.queryName}_results.csv`;
        element.click();
      } else {
        this.csvResults = '';
      }
    }
  }

  setExpandedRows = (newExpanded) => {
    this.expandedRows = Object.assign({}, this.expandedRows, newExpanded);
  }

  setShowShareDialog = (show) => {
    this.showShareDialog = !!show;
  }

  setUrlCopied = (copied) => {
    this.urlCopied = !!copied;
  }
}

export default QueryExecuteStore;
