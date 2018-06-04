import { observable } from 'mobx';

export default class GroupByBuilderStore {
  @observable groupBy = [];
  @observable allowExpandGroup = true;
  @observable aggregations = [];

  constructor() {
    this.groupBy = [];
    this.aggregations = [];
  }

  setGroupBy = (fieldsNames) => {
    if (fieldsNames) {
      this.groupBy.splice(0); //hhh
      fieldsNames.forEach((fieldName) => {
        this.groupBy.push(fieldName);
      });
    }
  };

  setAllowExpandGroup = (allowExpand) => {
    this.allowExpandGroup = allowExpand;
  }

  deleteGroupBy = (fieldName) => {
    if (fieldName) {
      const fieldGroupByIndex = this.groupBy.findIndex((field) => {
        return field === fieldName;
      });
      if (fieldGroupByIndex > -1) {
        this.groupBy.splice(fieldGroupByIndex, 1);
      }
    }
  }

  addAggregation = (aggregation) => {
    this.aggregations.push(aggregation);
  }
  findAggregation = (aggregationId) => {
    const aggregation = this.aggregations.find((x) => { return x.id === aggregationId; });
    return aggregation;
  }
  removeAggregation = (aggregationId) => {
    const aggregation = this.aggregations.find((x) => { return x.id === aggregationId; });
    const index = this.aggregations.indexOf(aggregation);
    this.aggregations.splice(index, 1);
  }
}

