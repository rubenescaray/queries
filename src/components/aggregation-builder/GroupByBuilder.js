import React, { Component } from 'react';
import { observer } from 'mobx-react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import Utils from '../../utils';
import Aggregation from './Aggregation';
import './GroupByBuilder.css';

const styles = {
  checkbox: {
    width: '50%',
    marginLeft: '50px',
    //marginBottom: 16,
  },
  select: {
    width: '50%',
  }
};

@observer
class AggregationBuilder extends Component {
  constructor(props) {
    super(props);
    this.aggregationIndex = 0;
    this.validationStore = props.validationStore;
  }
  filterFields = (item) => {
    return (this.props.store.aggregations.findIndex((aggregation) => { return aggregation.field === item.name; }) === -1);
  };
  handleChangeSelectGroupByField = (event, key, values) => {
    const fields = values.filter((value) => {
      const schemaElementIndex = this.props.schema.findIndex((schema) => {
        return schema.name === value;
      });
      return schemaElementIndex > -1;
    });
    this.props.store.setGroupBy(fields);
  };
  handleChangeAllowGroupxpandCheck = (event, isChecked) => {
    this.props.store.setAllowExpandGroup(isChecked);
  }
  handleChangeSelectAggregationField = (aggregationId, schemaName, fieldId) => {
    const element = this.props.schema.find((x) => { return x.name === schemaName; });
    const aggregation = this.props.store.findAggregation(aggregationId);
    aggregation.field = element.name;
    this.validationStore.deleteFieldErrors(fieldId);
    //this.updateSchemaFields();
  };
  handleChangeSelectAggregationFunction = (aggregationId, operator) => {
    const aggregation = this.props.store.findAggregation(aggregationId);
    aggregation.operator = operator;
  };
  addAggregation = () => {
    const guid = Utils.getNewId();
    const newAggregation = { id: guid, field: null, operator: null };
    this.props.store.addAggregation(newAggregation);
  }
  removeAggregation = (aggregationId, aggregationUuId) => {
    this.props.store.removeAggregation(aggregationId);
    this.validationStore.deleteParentErrors(aggregationUuId);
  }
  render() {
    const values = this.props.groupBy.slice();
    let addGroupByAggreation = null;
    let groupByAggregations = null;
    if (values !== null) {
      addGroupByAggreation = (<div><br /><FlatButton label="Agregar Agrupador" primary onClick={this.addAggregation} /></div>);
    }
    if (this.props.aggregations && this.props.aggregations.length > 0) {
      groupByAggregations = (<div className="groupby">
        {this.props.aggregations.map((aggregation) => {
          return (<Aggregation
            {...aggregation}
            key={aggregation.id}
            schema={this.props.schema}
            errorsFieldId={Utils.getNewId()}
            validationStore={this.validationStore}
            handleChangeSelectField={this.handleChangeSelectAggregationField}
            handleChangeSelectFunction={this.handleChangeSelectAggregationFunction}
            handleRemove={this.removeAggregation}
          />);
        })}
      </div>);
    }
    const menuItems = this.props.schema.map((schema) => {
      return <MenuItem key={schema.name} value={schema.name} primaryText={schema.name} insetChildren checked={values && values.includes(schema.name)} />;
    });
    return (
      <div>
        <div className="groupby horizontal" style={{ flexDirection: 'row' }}>
          <SelectField
            id={Utils.getNewId()}
            value={values}
            multiple
            style={styles.select}
            onChange={this.handleChangeSelectGroupByField}
            hintText="Seleccione agrupadores"
            hintStyle={{ color: '#FC9900', fontSize: '16px' }}
            underlineStyle={{ borderBottom: '1px solid #FC9900' }}
            iconStyle={{ fill: '#FC9900' }}
            floatingLabelStyle={{ color: '#AAAAAA', fontSize: '14px' }}
          >
            {menuItems}
          </SelectField>
          <Checkbox
            label="Mostrar detalle"
            style={styles.checkbox}
            disabled={this.props.store.groupBy.length === 0}
            checked={this.props.store.allowExpandGroup}
            onCheck={this.handleChangeAllowGroupxpandCheck}
          />
        </div>
        {addGroupByAggreation}
        {groupByAggregations}
      </div>
    );
  }
}

export default AggregationBuilder;
