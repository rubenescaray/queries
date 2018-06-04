import { observable } from 'mobx';

export default class CriteriaBuilderStore {
  @observable rules =[];

  constructor() {
    this.rules = [];
  }

  addRule = (rule) => {
    this.rules.push(rule);
  }
  findRule = (ruleId) => {
    const rule = this.rules.find((x) => { return x.id === ruleId; });
    return rule;
  }
  removeRule = (ruleId) => {
    const rule = this.rules.find((x) => { return x.id === ruleId; });
    const index = this.rules.indexOf(rule);
    this.rules.splice(index, 1);
  }
}

