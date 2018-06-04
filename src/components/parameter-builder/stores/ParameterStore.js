import { observable } from 'mobx';
import Utils from '../../../utils';

export class ParameterOptionsSource {
  @observable sourceId;
  source;
  @observable labelProperty;
  @observable valueProperty;

  constructor(sourceId, label, value) {
    this.sourceId = sourceId;
    this.labelProperty = label;
    this.valueProperty = value;
  }
}

export class Parameter {
  @observable id;
  @observable name;
  @observable label;
  @observable requireOnExecution;
  @observable allowNull;
  @observable type;
  @observable value;
  @observable optionsSource;

  constructor(id, name, label, required, allowNull, type, value, optionsSource) {
    this.id = id;
    this.name = name;
    this.label = label;
    this.requireOnExecution = required;
    this.allowNull = allowNull;
    this.type = type;
    this.value = value;
    this.optionsSource = optionsSource ? new ParameterOptionsSource(optionsSource.sourceId, optionsSource.label, optionsSource.value) : undefined;
  }
}

export default class ParameterStore {
  @observable parameters =[];
  @observable showOptionsConfigDialog = false;
  @observable sourcesEdittingParameter;

  constructor() {
    this.parameters = [];
  }
  addParameter = (parameter) => {
    const storeParameter = new Parameter(parameter.id, parameter.name, parameter.label, parameter.requireOnExecution, parameter.allowNull, parameter.type, parameter.value, parameter.optionsSource);
    this.parameters.push(storeParameter);
  }
  findParameter = (parameterId) => {
    let parameter;
    if (parameterId) {
      parameter = this.parameters.find((x) => { return x.id === parameterId; });
    }
    return parameter;
  }
  removeParameter = (parameterId) => {
    const parameter = this.parameters.find((x) => { return x.id === parameterId; });
    const index = this.parameters.indexOf(parameter);
    this.parameters.splice(index, 1);
  }
  clear = () => {
    this.parameters = [];
  }

  setSourcesEdittingParameter = (parameterId, parameter) => {
    if (parameter) {
      this.sourcesEdittingParameter = parameter;
    } else {
      const param = this.findParameter(parameterId);
      this.sourcesEdittingParameter = param;
    }
  }

  loadParameterFromList = (parameters) => {
    parameters.map((param) => {
      const newP = {
        id: Utils.getNewId(),
        name: param.name,
        label: param.label,
        type: param.type,
        value: null,
        allowNull: param.allowNull,
        requireOnExecution: false
      };
      return this.addParameter(newP);
    });
  }

}

