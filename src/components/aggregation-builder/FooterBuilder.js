import React, { Component } from 'react';
import { observer } from 'mobx-react';
import FlatButton from 'material-ui/FlatButton';
import Utils from '../../utils';
import Aggregation from './Aggregation';
import './FooterBuilder.css';

@observer
class FooterBuilder extends Component {
  constructor(props) {
    super(props);
    this.aggregationIndex = 0;
    this.validationStore = props.validationStore;
  }
  handleChangeSelectAggregationField = (aggregationId, schemaName, fieldId) => {
    const element = this.props.schema.find((x) => { return x.name === schemaName; });
    const aggregation = this.props.store.findAggregation(aggregationId);
    aggregation.field = element.name;
    this.props.store.setAggregation(aggregation);
    this.validationStore.deleteFieldErrors(fieldId);
  };
  handleChangeSelectAggregationFunction = (aggregationId, operator) => {
    const aggregation = this.props.store.findAggregation(aggregationId);
    aggregation.operator = operator;
    this.props.store.setAggregation(aggregation);
  };
  addAggregation = () => {
    const newAggregation = { id: this.aggregationIndex++, field: null, operator: null };
    this.props.store.addAggregation(newAggregation);
  }
  removeAggregation = (aggregationId, aggregationUuId) => {
    this.props.store.removeAggregation(aggregationId);
    this.validationStore.deleteParentErrors(aggregationUuId);
  }
  render() {
    let footerAggregations = null;
    if (this.props.aggregations && this.props.aggregations.length > 0) {
      footerAggregations = (<div className="footers">
        {this.props.aggregations.map((aggregation) => {
          return (<Aggregation
            {...aggregation}
            key={aggregation.id}
            errorsFieldId={Utils.getNewId()}
            validationStore={this.validationStore}
            schema={this.props.schema}
            handleChangeSelectField={this.handleChangeSelectAggregationField}
            handleChangeSelectFunction={this.handleChangeSelectAggregationFunction}
            handleRemove={this.removeAggregation}
          />);
        })}
      </div>);
    }
    return (
      <div>
        <FlatButton label="Agregar Sumarización" primary onClick={this.addAggregation} />
        {footerAggregations}
      </div>
    );
  }
}

export default FooterBuilder;
