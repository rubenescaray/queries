import { observable } from 'mobx';
import Utils from '../../../utils';
import { sourceService } from '../../../services/Services';

export class ParameterValue {
  @observable id;
  @observable name;
  @observable label;
  @observable requireOnExecution;
  @observable type;
  optionsSource;
  @observable options;
  @observable value;

  constructor(id, name, label, required, type, optionsSource, value) {
    this.id = id;
    this.name = name;
    this.label = label;
    this.requireOnExecution = required;
    this.type = type;
    if (optionsSource && optionsSource.sourceId) {
      sourceService.executeById(optionsSource.sourceId)
    .then((options) => {
      this.optionsSource = optionsSource;
      this.options = options;
    });
    }
    this.value = value;
  }
}

export default class ParameterValuesStore {
  @observable parameters = [];
  @observable selectedValuesMultiSelect = [];
  @observable isSelectedAllMultiSelect = false;

  constructor() {
    this.parameters = [];
  }

  setSelectedValuesMultiSelect = (values) => {
    this.selectedValuesMultiSelect = values;
  };

  setIsSelectedAllMultiSelect = () => {
    this.isSelectedAllMultiSelect = !this.isSelectedAllMultiSelect;
  };

  fillParameters = (fields, parameterValues) => {
    this.parameters = [];
    fields.forEach((field) => {
      let parameter;
      let value;
      if (parameterValues) {
        value = parameterValues.find((paramValue) => { return paramValue.name === field.name; });
        if (value) {
          parameter = new ParameterValue(Utils.getNewId(), field.name, value.label, value.requireOnExecution, field.type, field.optionsSource, value.value);
        } else {
          parameter = new ParameterValue(Utils.getNewId(), field.name, undefined, true, field.type, field.optionsSource, undefined);
        }
      } else {
        parameter = new ParameterValue(Utils.getNewId(), field.name, field.label, true, field.type, field.optionsSource, undefined);
      }
      this.parameters.push(parameter);
    });
  }
  findParameter = (fieldName) => {
    const parameter = this.parameters.find((x) => { return x.name === fieldName; });
    return parameter;
  }
  clear = () => {
    this.parameters = [];
  }
  getDataForTest = () => {
    const data = this.parameters.map((parameter) => {
      return { name: parameter.name, type: parameter.type, value: parameter.value };
    });
    return data;
  }
  getDataForSave = () => {
    const data = this.parameters.map((parameter) => {
      return { name: parameter.name, type: parameter.type, label: parameter.label, value: parameter.value, requireOnExecution: parameter.requireOnExecution };
    });
    return data;
  }
}

