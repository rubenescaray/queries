import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Text from '../inputs/Text';
import './Field.css';

const styles = {
  block: {
    maxWidth: 250,
  },
  checkbox: {
    marginBottom: 16,
  },
};

@observer
class Field extends Component {
  handleChangeCheck = (event, isChecked) => {
    this.props.handleChangeCheckbox(this.props.id, isChecked);
  }
  handleChangeInput = (value) => {
    this.props.handleChangeInput(this.props.id, value);
  }
  handleChangeType = (event, index, type) => {
    this.props.handleChangeType(this.props.id, type);
  }
  render() {
    const { onlyCheckAndLabel } = this.props;
    const disabledLabel = onlyCheckAndLabel || false;
    console.log('disabledLabel', disabledLabel);
    return (
      <div className="field">
        <div className="column" style={{ width: '7%', marginTop: '10px' }}>
          <Checkbox
            label=""
            style={styles.checkbox}
            checked={this.props.include}
            onCheck={this.handleChangeCheck}
          />
        </div>
        {!onlyCheckAndLabel && <div className="column" style={{ width: '24%', overflow: 'hidden' }}>{this.props.name}</div>}
        <div className="column" style={{ width: '24%' }}>
          <Text
            disabled={disabledLabel}
            fullWidth
            value={this.props.label}
            id={this.props.id}
            name={this.props.name}
            key={this.props.id}
            handleChange={this.handleChangeInput}
            inputStyle={{ fontSize: '12px' }}
            hintStyle={{ fontSize: '12px' }}
            style={{ width: '85%', overflow: 'hidden' }}
          />
        </div>
        {!onlyCheckAndLabel &&
        <div className="column" style={{ width: '36%' }}>
          <SelectField
            onChange={this.handleChangeType}
            value={this.props.type}
            labelStyle={{ fontSize: '12px' }}
          >
            <MenuItem value={'text'} primaryText="Texto" style={{ fontSize: '12px' }} />
            <MenuItem value={'number'} primaryText="Número" />
            <MenuItem value={'numberWithTwoDecimals'} primaryText="Número con dos decimales" />
            <MenuItem value={'percentage'} primaryText="Porcentaje" />
            <MenuItem value={'currencyWithTwoDecimals'} primaryText="Moneda" />
            <MenuItem value={'date'} primaryText="Fecha" />
            <MenuItem value={'time'} primaryText="Hora" />
            <MenuItem value={'dateTime'} primaryText="Fecha y hora" />
          </SelectField>
        </div>}
        <div style={{ clear: 'both' }} />
      </div>
    );
  }
}

export default Field;
