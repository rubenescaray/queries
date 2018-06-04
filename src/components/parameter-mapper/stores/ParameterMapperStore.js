import { observable, runInAction } from 'mobx';

class Parameter {
  @observable paramName;
  @observable fieldName;

  constructor(paramName, fieldName) {
    this.paramName = paramName;
    this.fieldName = fieldName;
  }
}

class ParameterMapperStore {
  @observable parameters = [];

  constructor() {
    this.parameters = [];
  }

  loadProperties = (mappedParams, params) => {
    runInAction(() => {
      this.parameters.splice();
      this.parameters.push(...params.map((p) => {
        const param = new Parameter(p.name, '');
        const mapa = mappedParams || [];
        mapa.forEach((mp) => {
          if (mp.childParamName === p.name) {
            param.fieldName = mp.fieldName;
          }
        });
        return param;
      }));
    });
    console.log(this.parameters);
  };


  setParamFieldName = (paramName, value) => {
    const paramMap = this.parameters.find((x) => { return x.paramName === paramName; });
    if (paramMap) {
      paramMap.fieldName = value;
    }
  }

  addParameter = (parameter) => {
    this.parameters.push(new Parameter(parameter.childParamName, parameter.childParamName, parameter.fieldName));
  }

  getMappedParameters = () => {
    let mappedValues = [];
    if (this.parameters.length > 0) {
      mappedValues = this.parameters.map((p) => { return { fieldName: p.fieldName, childParamName: p.paramName }; });
    }
    return mappedValues;
  }
}

export default ParameterMapperStore;
