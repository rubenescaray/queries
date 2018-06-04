import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Integer from '../inputs/Integer';
import Decimal from '../inputs/Decimal';
import DateInput from '../inputs/Date';
import Text from '../inputs/Text';


const renderParameterValue = (props, handleChange) => {
  if (props.optionsSource) {

    const allValues = [];
    const getValues = () => {
      const values = props.options.result.map((option) => {
        allValues.push(option[props.optionsSource.valueProperty]);
        return {
          key: option[props.optionsSource.valueProperty],
          value: option[props.optionsSource.valueProperty],
          primaryText: option[props.optionsSource.labelProperty]
        };
      });
      values.unshift({
        key: 0,
        value: 'all',
        primaryText: 'Todos'
      });
      return values;
    };

    const menuItems = (values) => {
      let count = 0;
      return getValues().map((item) => {
        count++;
        return (<MenuItem
          key={item.key}
          insetChildren
          checked={(values && values.indexOf(item.value) > -1) || (count === 1 && props.store.isSelectedAllMultiSelect)}
          value={item.value}
          primaryText={item.primaryText}
        />);
      });
    };

    const handleChecked = (event, index, values) => {
      //console.log('handle', values);
      if (values.indexOf('all') > -1) {
        if (props.store.isSelectedAllMultiSelect === false) {
          props.store.setSelectedValuesMultiSelect(allValues);
          handleChange(allValues);
        } else {
          props.store.setSelectedValuesMultiSelect([]);
          handleChange([]);
        }
        props.store.setIsSelectedAllMultiSelect();
      } else {
        props.store.setSelectedValuesMultiSelect(values);
        handleChange(values);
      }
    };

    return (
      <SelectField
        multiple
        hintText="Seleccione valores"
        floatingLabelText={props.label ? props.label : props.name}
        key={props.name}
        value={props.store.selectedValuesMultiSelect}
        onChange={handleChecked}
        labelStyle={{ color: '#AAA' }}
        floatingLabelStyle={{ color: '#AAA' }}
        floatingLabelFocusStyle={{ color: '#AAA' }}
        underlineFocusStyle={{ borderColor: '#ff9933' }}
      >
        {
          menuItems(props.store.selectedValuesMultiSelect)
        }
      </SelectField>
    );
  }
  switch (props.type) {
  case 'string':
    return <Text hintText=" " floatingLabelStyle={{ color: '#AAAAAA', fontSize: '16px' }} inputStyle={{ color: '#FC9900', display: 'block' }} underlineStyle={{ borderBottom: '1px solid #FC9900' }} floatingLabelFocusStyle={{ color: '#AAA' }} hintStyle={{ color: '#FC9900', fontSize: '16px' }} underlineFocusStyle={{ borderColor: '#ff9933' }} floatingLabelFixed floatingLabelText={props.label ? props.label : props.name} key={props.name} {...props} validationStore={props.validationStore} handleChange={handleChange} />;
  case 'int':
    return <Integer hintText=" " floatingLabelStyle={{ color: '#AAAAAA', fontSize: '16px' }} inputStyle={{ color: '#FC9900', display: 'block' }} underlineStyle={{ borderBottom: '1px solid #FC9900' }} floatingLabelFocusStyle={{ color: '#AAA' }} hintStyle={{ color: '#FC9900', fontSize: '16px' }} underlineFocusStyle={{ borderColor: '#ff9933' }} floatingLabelFixed floatingLabelText={props.label ? props.label : props.name} key={props.name} {...props} validationStore={props.validationStore} handleChange={handleChange} />;
  case 'decimal':
    return <Decimal hintText=" " floatingLabelStyle={{ color: '#AAAAAA', fontSize: '16px' }} inputStyle={{ color: '#FC9900', display: 'block' }} underlineStyle={{ borderBottom: '1px solid #FC9900' }} hintStyle={{ color: '#FC9900', fontSize: '16px' }} floatingLabelFocusStyle={{ borderColor: '#ff9933' }} underlineFocusStyle={{ color: '#ff9933' }} floatingLabelFixed floatingLabelText={props.label ? props.label : props.name} key={props.name} {...props} validationStore={props.validationStore} handleChange={handleChange} />;
  case 'date':
    return (<DateInput hintText=" " floatingLabelStyle={{ color: '#AAA', fontSize: '16px', whiteSpace: 'nowrap' }} inputStyle={{ color: '#FC9900', display: 'block' }} underlineStyle={{ borderBottom: '1px solid #FC9900' }} hintStyle={{ color: '#FC9900', fontSize: '16px' }} floatingLabelFocusStyle={{ color: '#AAA', whiteSpace: 'nowrap' }} underlineFocusStyle={{ borderColor: '#ff9933' }} floatingLabelFixed floatingLabelText={props.label ? props.label : props.name} key={props.name} {...props} validationStore={props.validationStore} handleChange={handleChange} />);
  case 'boolean':
    return <Boolean hintText=" " floatingLabelFixed floatingLabelText={props.label ? props.label : props.name} key={props.name} {...props} validationStore={props.validationStore} handleChange={handleChange} />;
  default:
    throw new Error(`Unsupported type: ${props.type}`);
  }
};
const parametersStyle = {
  flexDirection: 'row',
  display: 'flex',
  flexGrow: '1',
  flexWrap: 'wrap',
  backgroundColor: '#ffffff',
  border: '0px solid #e6e6e6',
  margin: '0px',
  marginLeft: '0px',
  marginRight: '0px',
};

const columnStyle = {
  display: 'flex',
  alignItems: 'center',
  flexGrow: '1',
  flexBasis: '0',
  verticalAlign: 'middle',
  justifyContent: 'flex-start',
};

@observer
class Parameter extends Component {
  handleChangeInputValue = (value) => {
    this.props.handleChangeInputValue(this.props.name, value);
  }
  handleChangeLabelValue = (value) => {
    this.props.handleChangeLabelValue(this.props.name, value);
  }
  handleChangeCheckBoxValue = (event, isChecked) => {
    this.props.handleChangeCheckBoxValue(this.props.name, isChecked);
  }
  render() {
    if (this.props.sourceExecute) {
      parametersStyle.width = 'auto';
      columnStyle.marginLeft = '0px';
    } else if (this.props.editingMode === undefined || this.props.editingMode === false) {
      parametersStyle.width = `${(100 * (1 / 4)) - 10 - 1}%px`;
      columnStyle.marginLeft = '30px';
    } else {
      parametersStyle.width = 'auto';
      columnStyle.marginLeft = '0px';
    }
    return (
      <div style={parametersStyle}>
        <div style={{ ...columnStyle, width: '30%', marginRight: '20px', overflow: 'hidden' }}>
          {renderParameterValue(this.props, this.handleChangeInputValue)}
        </div>
        {this.props.editingMode && !this.props.onlyLabelAndValue &&
        <div style={{ ...columnStyle, width: '35%', marginLeft: '0px', marginRight: '25px' }}>
          <Text
            value={this.props.label}
            fullWidth={false}
            floatingLabelFixed
            floatingLabelText="Etiqueta"
            key={this.props.name}
            handleChange={this.handleChangeLabelValue}
            inputStyle={{ fontSize: '12px', color: 'black' }}
            labelStyle={{ color: 'black' }}
            floatingLabelStyle={{ color: '#AAA' }}
            floatingLabelFocusStyle={{ color: '#AAA' }}
            underlineFocusStyle={{ borderColor: '#ff9933' }}
          />
        </div>
        }
        {this.props.editingMode && !this.props.onlyLabelAndValue &&
        <div style={{ ...columnStyle, width: '25%' }}>
          <Checkbox
            label="Requerido"
            checked={this.props.requireOnExecution}
            onCheck={this.handleChangeCheckBoxValue}
            labelStyle={{ color: '#AAA', fontSize: '12px' }}
          />
        </div>
        }
      </div>
    );
  }
}

export default Parameter;
