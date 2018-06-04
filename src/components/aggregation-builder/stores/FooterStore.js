import { observable } from 'mobx';

export default class FooterStore {
  @observable aggregations = [];

  constructor() {
    this.aggregations = [];
  }

  addAggregation = (aggregation) => {
    this.aggregations.push(aggregation);
  }
  findAggregation = (aggregationId) => {
    const aggregation = this.aggregations.find((x) => { return x.id === aggregationId; });
    return aggregation;
  }
  setAggregation = (aggregation) => {
    const aggregationIndex = this.aggregations.findIndex((x) => { return x.id === aggregation.id; });
    if (aggregationIndex > -1) {
      this.aggregations.splice(aggregationIndex, 1);
    }
    this.aggregations.push(aggregation);
  }
  removeAggregation = (aggregationId) => {
    const aggregation = this.aggregations.find((x) => { return x.id === aggregationId; });
    const index = this.aggregations.indexOf(aggregation);
    this.aggregations.splice(index, 1);
  }
}

