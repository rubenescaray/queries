import React, { Component } from 'react';
import { observer } from 'mobx-react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import { Row, Column } from '../../components/layout/gridSystem';

const columnStyle = {
  display: 'flex',
  flexGrow: '1',
  flexBasis: '0',
  padding: '8px',
  alignItems: 'center',
  paddingBottom: '30px',
};

@observer
class Parameter extends Component {

  handleChangeParam = (param, value) => {
    this.props.handleChangeParamFieldName(param, value);
  }

  render() {
    const { options } = this.props;

    return (
      <div style={{ fontSize: '12px' }}>
        <Row>
          <Column>
            <TextField
              defaultValue={this.props.paramName}
              inputStyle={{ color: 'rgb(170, 170, 170)' }}
            />
          </Column>
          <Column style={columnStyle}>
            <SelectField
              floatingLabelText="Seleccione columna"
              underlineShow
              fullWidth
              style={{ fontSize: '13px' }}
              onChange={(event, index, value) => { return this.handleChangeParam(this.props.paramName, value); }}
              value={this.props.fieldName}
            >
              {options.map((column) => {
                return <MenuItem key={column.id} value={column.name} primaryText={column.label} />;
              })}
            </SelectField>
          </Column>
        </Row>
      </div>
    );
  }
}

export default Parameter;
