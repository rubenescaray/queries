import { observable, runInAction } from 'mobx';

class DashboardStore {

  // all queries availables for executing in the widget
  @observable queries = [];
  @observable query;
  @observable querySource;
  queryParameters;
  dataWidget;
  @observable fetching = false;
  @observable isOpenDialog = false;

  // Observables para los datos de la grilla
  @observable schema = [];
  @observable results = [];
  @observable widgetTitle = 'A title';
  @observable widgetDimensions = { width: 4, height: 4 };

  constructor(dashboardService, queryService, parameterValuesStore, selectFilterStore, snackBarStore) {
    this.dashboardService = dashboardService;
    this.queryService = queryService;
    this.parameterValuesStore = parameterValuesStore;
    this.selectFilterStore = selectFilterStore;
    this.snackBarStore = snackBarStore;
  }

  // for showing queries when widget is being edited
  fetchQueries() {
    if (this.queries.length === 0) {
      this.fetching = true;
      this.queryService.fetch()
      .then((result) => {
        runInAction(() => {
          this.queries = result;
          this.fetching = false;
        });
      }).catch((error) => {
        this.snackBarStore.setMessage(error);
      });
    }
  }

  findQueryByIndex = (index) => {
    const query = this.queries[index];
    return query;
  }

  getQueryById(id) {
    return new Promise((resolve, reject) => {
      this.queryService.get(id)
      .then((query) => {
        this.query = query;
        this.querySource = query.source;
        //console.log('getQueryById', query);
        return resolve(query);
      }).catch((error) => {
        return reject(error);
      });
    });
  }

  executeQueryById = (id) => {
    this.getQueryById(id)
      .then((query) => {
        //console.log('executeQueryById', query);
        runInAction(() => {
          // Ejecutar la Consulta según el Query obtenido
          this.executeQuery(query);
        });
      }).catch((error) => {
        this.snackBarStore.setMessage(error);
      });
  }

  executeQueryByIdAndFillParamFilters = (id) => {
    if (id !== '00000000-0000-0000-0000-000000000000') {
      this.fetching = true;
      this.getQueryById(id)
        .then((query) => {
          //console.log('executeQueryAndFillParameters', query);
          runInAction(() => {
            this.fetching = false;
            this.fillParametersAndSelectFilters(query);
            // Ejecutar la Consulta según el Query obtenido
            this.executeQuery(query);
          });
        }).catch((error) => {
          this.snackBarStore.setMessage(error);
        });
    }
  };

  combineQueryParameters = (parameters) => {
    const queryParameters = [];
    if (this.dataWidget.queryParameters.length === 0) {
      return parameters;
    }
    parameters.forEach((item, index) => {
      if (item.name === this.dataWidget.queryParameters[index].name) {
        queryParameters.push({
          name: item.name,
          value: this.dataWidget.queryParameters[index].value,
          label: item.label,
          requireOnExecution: item.requireOnExecution
        });
      } else {
        queryParameters.push(item);
      }
    });
    return queryParameters;
  };

  fillParametersAndSelectFilters = (query) => {
    this.parameterValuesStore.fillParameters(query.source.parameters, this.combineQueryParameters(query.parameters));
    switch (this.dataWidget.widgetType) {
    case 'GridWidget':
      // Llenar Array Object @observable "this.parameterValuesStore.parameters" con objetos "ParameterValue"
      //console.log('query.parameters', query.parameters);
      //console.log('this.dataWidget.queryParameters', this.dataWidget.queryParameters);
      //console.log('MY queryParameters', this.combineQueryParameters(query.parameters));
      //this.parameterValuesStore.fillParameters(query.source.parameters, this.combineQueryParameters(query.parameters));
      // Llenar Array Object @observable "this.selectFilterStore.selects" con objetos "SelectField"
      this.selectFilterStore.mixSchemaWithSelects(query.source.schema, query.selects);
      //console.log('this.selectFilterStore', this.selectFilterStore);
      break;
    default:
      return null;
    }
  };

  // Ejecutar la Consulta según el Query obtenido
  executeQuery = (query) => {
    //console.log('QUERY', query);
    //console.log('this.getParameters(query.source)', this.getParameters(query.source));
    this.queryParameters = this.getParameters(query.source);
    const executeParams = {
      queryId: query.id,
      parameters: this.getParameters(query.source),
      filters: [], //this.criteriaBuilderStore.rules,
      complete: true
    };
    runInAction(() => {
      this.fetching = true;
      this.schema = [];
      this.results = [];
    });
    this.queryService.execute(executeParams).then((result) => {
      runInAction(() => {
        this.schema = result.schema;
        this.results = result.result;
        this.fetching = false;
        //console.log('Datos devueltos Consulta:', this.results);
      });
    }).catch((error) => {
      this.snackBarStore.setMessage(error);
    });
  };

  getParameters = (querySource) => {
    let parameterValues = this.parameterValuesStore.getDataForTest();
    parameterValues = parameterValues.map((pv) => {
      const pvAux = pv;
      const sourceParam = querySource.parameters.find((sp) => {
        return sp.name === pvAux.name;
      });
      if (sourceParam && sourceParam.allowNull && pvAux.value === '') {
        pvAux.value = null;
      }
      return pvAux;
    });
    return parameterValues;
  };

}

export default DashboardStore;
