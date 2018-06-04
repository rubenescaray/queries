import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
//import ActionDelete from 'material-ui/svg-icons/action/delete';
import MenuItem from 'material-ui/MenuItem';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import './Aggregation.css';
import Utils from '../../utils';

const styles = {
  iconsBG: {
    backgroundColor: 'rgb(170, 170, 170)',
    //padding: '2px',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    height: '38px',
    width: '32px',
    marginTop: '2px',
  },
};

const renderField = (props, handleChangeSelectField) => {
  const value = props.field;
  return (
    <SelectField
      floatingLabelText="Campo"
      value={value}
      onChange={handleChangeSelectField}
      hintText="Seleccionar"
      hintStyle={{ color: '#FC9900', fontSize: '16px' }}
      underlineStyle={{ borderBottom: '1px solid #FC9900' }}
      iconStyle={{ fill: '#FC9900' }}
      floatingLabelStyle={{ color: '#AAAAAA', fontSize: '14px' }}
    >
      <MenuItem key={null} value={null} primaryText="" />
      { props.schema.map((schema) => {
        return <MenuItem key={schema.id} value={schema.name} primaryText={schema.label} />;
      })
    }
    </SelectField>
  );
};

const renderFunction = (props, handleChangeSelectFunction) => {
  const value = props.operator;
  return (
    <SelectField
      floatingLabelText="Función"
      value={value}
      onChange={handleChangeSelectFunction}
      fullWidth
      floatingLabelStyle={{ color: '#AAAAAA', fontSize: '14px' }}
      hintText="Seleccionar"
      hintStyle={{ color: '#FC9900', fontSize: '16px' }}
      underlineStyle={{ borderBottom: '1px solid #FC9900' }}
      iconStyle={{ fill: '#FC9900' }}
    >
      <MenuItem key={null} value={null} primaryText="" />
      <MenuItem value="sum" primaryText="Suma" />
      <MenuItem value="mean" primaryText="Promedio" />
      <MenuItem value="max" primaryText="Máximo" />
      <MenuItem value="min" primaryText="Mínimo" />
      <MenuItem value="setSize" primaryText="Cantidad" />
    </SelectField>
  );
};


class Aggregation extends Component {
  constructor(props) {
    super(props);
    this.inputFieldId = Utils.getNewId();
    this.aggregationUuId = Utils.getNewId();
  }
  handleChangeSelectField = (event, index, value) => {
    this.props.handleChangeSelectField(this.props.id, value, this.inputFieldId);
  }
  handleChangeSelectFunction = (event, index, value) => {
    this.props.handleChangeSelectFunction(this.props.id, value);
  }
  handleDelete = () => {
    this.props.handleRemove(this.props.id, this.aggregationUuId);
  }
  render() {
    const errors = this.props.validationStore.getFieldErrors(this.props.errorsFieldId);
    let css;
    if (errors && errors.length > 0) {
      css = 'validationError';
    }
    return (
      <div className={`aggregation ${css}`}>
        <div className="column">{renderField(this.props, this.handleChangeSelectField)}</div>
        <div className="column">{renderFunction(this.props, this.handleChangeSelectFunction)}</div>
        <div className="column">
          <DeleteIcon
            onClick={this.handleDelete}
            style={{ ...styles.iconsBG }}
          />
        </div>
      </div>
    );
  }
}

export default Aggregation;
