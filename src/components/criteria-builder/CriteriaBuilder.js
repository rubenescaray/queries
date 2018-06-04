import React, { Component } from 'react';
import { observer } from 'mobx-react';
//import FlatButton from 'material-ui/FlatButton';
import Utils from '../../utils';
import Rule from './Rule';
import './CriteriaBuilder.css';

@observer
class CriteriaBuilder extends Component {
  constructor(props) {
    super(props);
    this.ruleIndex = 0;
    this.validationStore = this.props.validationStore;
  }
  handleChangeInput = (ruleId, value) => {
    const rule = this.props.store.findRule(ruleId);
    rule.value = value;
  }
  handleChangeSelectField = (ruleId, schemaName, fieldId) => {
    const element = this.props.schema.find((x) => { return x.name === schemaName; });
    const rule = this.props.store.findRule(ruleId);
    if (rule) {
      rule.field = element.name;
      rule.type = element.type;
    }
    if (fieldId) {
      this.props.validationStore.deleteFieldErrors(fieldId);
    }
  };
  handleChangeSelectOperator = (ruleId, operator) => {
    const rule = this.props.store.findRule(ruleId);
    if (rule) {
      rule.operator = operator;
    }
  };
  addRule = () => {
    const newRule = { id: Utils.getNewId(), field: null, type: null, operator: 'equal', value: null };
    this.props.store.addRule(newRule);
  }
  removeRule = (ruleId, ruleUuId) => {
    this.props.store.removeRule(ruleId);
    this.props.validationStore.deleteParentErrors(ruleUuId);
  }
  render() {
    return (
      <div>
        {/*<FlatButton label="Agregar Filtro" primary onClick={this.addRule} />*/}
        <div className="criteria">
          {this.props.rules.map((rule) => {
            return (<Rule
              {...rule}
              key={rule.id}
              schema={this.props.schema}
              validationStore={this.validationStore}
              errorsFieldId={Utils.getNewId()}
              handleChangeSelectField={this.handleChangeSelectField}
              handleChangeSelectOperator={this.handleChangeSelectOperator}
              handleChangeInput={this.handleChangeInput}
              handleRemove={this.removeRule}
            />);
          })}
        </div>
      </div>
    );
  }
}

export default CriteriaBuilder;
