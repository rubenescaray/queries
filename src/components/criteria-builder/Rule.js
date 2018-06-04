import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ActionDelete from 'material-ui/svg-icons/action/delete';
//import RaisedButton from 'material-ui/RaisedButton';
import { observer } from 'mobx-react';
import Utils from '../../utils';
import Palette from '../../Palette';

import Text from '../inputs/Text';
import Integer from '../inputs/Integer';
import Decimal from '../inputs/Decimal';
import DateInput from '../inputs/Date';
import Boolean from '../inputs/Boolean';
import './Rule.css';


const renderField = (props, handleChangeSelectField) => {
  return (
    <SelectField
      floatingLabelText="Campo"
      floatingLabelFixed
      floatingLabelStyle={{ color: '#BBB' }}
      value={props.field}
      onChange={handleChangeSelectField}
      fullWidth
      labelStyle={{ color: '#000', fontWeight: 'bold' }}
      iconStyle={{ fill: '#F5683A' }}
    >
      { props.schema.map((schema) => {
        return <MenuItem key={schema.id} value={schema.name} primaryText={schema.label ? schema.label : schema.name} />;
      })
    }
    </SelectField>
  );
};

const renderOperator = (props, handleChangeSelectOperator) => {
  return (
    <SelectField
      floatingLabelText="Operador"
      floatingLabelStyle={{ color: '#BBB' }}
      value={props.operator}
      onChange={handleChangeSelectOperator}
      fullWidth
      labelStyle={{ color: '#000', fontWeight: 'bold', fontSize: '12px' }}
      underlineFocusStyle={{ fill: '#F5683A' }}
      underlineStyle={{ fill: '#F5683A' }}
      iconStyle={{ fill: '#F5683A' }}
      style={{ backgroundColor: '#FFF' }}
    >
      <MenuItem value="equal" primaryText="Igual" />
      <MenuItem value="not_equal" primaryText="Distinto" />
      <MenuItem value="greater" primaryText="Mayor" />
      <MenuItem value="greater_or_equal" primaryText="Mayor o iqual" />
      <MenuItem value="less" primaryText="Menor" />
      <MenuItem value="less_or_equal" primaryText="Menor o igual" />
    </SelectField>
  );
};

const renderInput = (props, ruleUuId, fieldUuId, handleChangeInput) => {
  console.log('props.type', props.type);
  switch (props.type) {
  case 'string':
    return <Text key={props.id} {...props} floatingLabelStyle={{ color: '#AAA' }} inputStyle={{ fontSize: '12px', fontWeight: 'bold' }} floatingLabelFocusStyle={{ color: '#AAA' }} color={Palette.parametersFilter.filterTextFieldColor} floatingLabelFixed floatingLabelText="Valor" defaultValue={props.value} parentId={ruleUuId} fieldId={fieldUuId} name={props.field} required handleChange={handleChangeInput} />;
  case 'int':
  case 'int32':
  case 'int64':
    return <Integer key={props.id} {...props} floatingLabelStyle={{ color: '#AAA' }} inputStyle={{ fontSize: '12px', fontWeight: 'bold' }} floatingLabelFocusStyle={{ color: '#AAA' }} color={Palette.parametersFilter.filterTextFieldColor} floatingLabelFixed floatingLabelText="Valor" defaultValue={props.value} parentId={ruleUuId} fieldId={fieldUuId} validationStore={props.validationStore} required name={props.field} handleChange={handleChangeInput} />;
  case 'decimal':
    return <Decimal key={props.id} {...props} floatingLabelStyle={{ color: '#AAA' }} inputStyle={{ fontSize: '12px', fontWeight: 'bold' }} floatingLabelFocusStyle={{ color: '#AAA' }} color={Palette.parametersFilter.filterTextFieldColor} floatingLabelFixed defaultValue={props.value} parentId={ruleUuId} fieldId={fieldUuId} validationStore={props.validationStore} required name={props.field} handleChange={handleChangeInput} />;
  case 'datetime':
    return <DateInput key={props.id} {...props} floatingLabelStyle={{ color: '#AAA' }} inputStyle={{ fontSize: '12px', fontWeight: 'bold' }} floatingLabelFocusStyle={{ color: '#AAA' }} color={Palette.parametersFilter.filterTextFieldColor} floatingLabelFixed floatingLabelText="Valor" parentId={ruleUuId} fieldId={fieldUuId} validationStore={props.validationStore} required name={props.field} handleChange={handleChangeInput} />;
  case 'boolean':
    return <Boolean key={props.id} {...props} floatingLabelStyle={{ color: '#AAA' }} inputStyle={{ fontSize: '12px', fontWeight: 'bold' }} floatingLabelFocusStyle={{ color: '#AAA' }} color={Palette.parametersFilter.filterTextFieldColor} floatingLabelFixed parentId={ruleUuId} fieldId={fieldUuId} validationStore={props.validationStore} required name={props.field} handleChange={handleChangeInput} />;
  default:
    return '';
  }
};

@observer
class Rule extends Component {

  constructor(props) {
    super(props);
    this.ruleUuId = Utils.getNewId();
    this.inputFieldId = Utils.getNewId();
  }

  handleChangeSelectField = (event, index, value) => {
    this.props.handleChangeSelectField(this.props.id, value, this.inputFieldId);
  }
  handleChangeSelectOperator = (event, index, value) => {
    this.props.handleChangeSelectOperator(this.props.id, value);
  }
  handleChangeInput = (value) => {
    this.props.handleChangeInput(this.props.id, value);
  }
  handleDelete = () => {
    this.props.handleRemove(this.props.id, this.ruleUuId);
  }
  render() {
    let cssClass = 'rule';
    if (this.props.validationStore.errors.length !== 0) {
      const ruleErrors = this.props.validationStore.getParentErrors(this.ruleUuId);
      if (ruleErrors && ruleErrors.length > 0) {
        cssClass = `${cssClass}`;
      }
    }
    console.log(cssClass);
    return (
      <div>
        <div style={{ display: 'flex', flexFlow: 'row', boxSizing: 'border-box' }}>
          <div style={{ width: '30%', padding: '2px' }}>
            <div>{renderField(this.props, this.handleChangeSelectField)}</div>
          </div>
          <div style={{ width: '30%', padding: '2px' }}>
            {renderOperator(this.props, this.handleChangeSelectOperator)}
          </div>
          <div style={{ width: '30%', padding: '2px' }}>
            {renderInput(this.props, this.ruleUuId, this.inputFieldId, this.handleChangeInput)}
          </div>
          <div style={{ width: '10%', boxSizing: 'border-box', padding: '34px 5px' }}>
            <ActionDelete style={{ color: '#FFF', backgroundColor: '#A0A7B9', cursor: 'pointer', padding: '3px', borderRadius: '5px' }} onClick={this.handleDelete} />
          </div>
        </div>
      </div>
    );
  }
}

export default Rule;
