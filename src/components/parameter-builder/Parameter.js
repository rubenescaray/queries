import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import { observer } from 'mobx-react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import styled from 'styled-components';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import Utils from '../../utils';
import Text from '../inputs/Text';
import './Parameter.css';

const WrapperFilterContent = styled.div`
  // Small devices (phones, 320 to 768... less than 768px)
  @media (min-width: 320px) {
    height: auto;
    max-height: 500px;
  }

  @media (min-width: 1280px) {
    height: 100px;
  }
`;

const styles = {
  filterContent: {
    //padding: '15px 15px 0px 20px',
    backgroundColor: '#FFF',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'row',
  },
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

const renderParameterNameInput = (props, parameterUuId, fieldUuId, handleChangeInputName) => {
  return (
    <Text
      {...props}
      floatingLabelText="Parámetro"
      hintStyle={{ color: '#FC9900', fontSize: '16px' }}
      floatingLabelStyle={{ color: '#AAAAAA', fontSize: '14px' }}
      floatingLabelFixed
      fullWidth
      hintText={' '}
      inputStyle={{ color: '#FC9900', display: 'block' }}
      underlineStyle={{ borderBottom: '1px solid #FC9900' }}
      parentId={parameterUuId}
      id={fieldUuId}
      fieldId={fieldUuId}
      required
      value={props.name ? props.name : ''}
      handleChange={handleChangeInputName}
      disabled={props.execute ? props.execute : false}
    />
  );
};

const renderParameterLabelInput = (props, parameterUuId, fieldUuId, handleChangeInputLabel) => {
  return (
    <Text
      {...props}
      floatingLabelText="Etiqueta"
      hintStyle={{ color: '#FC9900', fontSize: '16px' }}
      floatingLabelStyle={{ color: '#AAAAAA', fontSize: '14px' }}
      floatingLabelFixed
      fullWidth
      inputStyle={{ color: '#FC9900', display: 'block' }}
      underlineStyle={{ borderBottom: '1px solid #FC9900' }}
      parentId={parameterUuId}
      id={fieldUuId}
      fieldId={fieldUuId}
      required
      value={props.label ? props.label : ''}
      handleChange={handleChangeInputLabel}
    />
  );
};

const renderParameterValueInput = (props, parameterUuId, fieldUuId, handleChangeInputValue) => {
  return (
    <Text
      {...props}
      floatingLabelText="Valor"
      hintStyle={{ color: '#FC9900', fontSize: '16px' }}
      floatingLabelStyle={{ color: '#AAAAAA', fontSize: '14px' }}
      floatingLabelFixed
      fullWidth
      inputStyle={{ color: '#FC9900', display: 'block', marginTop: '10px' }}
      underlineStyle={{ borderBottom: '1px solid #FC9900' }}
      parentId={parameterUuId}
      id={fieldUuId}
      fieldId={fieldUuId}
      disabled={props.allowNull && props.value === null}
      required={!props.allowNull}
      value={props.value ? props.value : ''}
      handleChange={handleChangeInputValue}
    />
  );
};

const renderParameterTypeSelect = (props, parameterUuId, fieldUuId, handleChangeSelectType) => {
  return (
    <SelectField
      floatingLabelText="Tipo"
      value={props.type}
      onChange={handleChangeSelectType}
      disabled={props.execute ? props.execute : false}
      floatingLabelStyle={{ color: '#AAAAAA', fontSize: '14px' }}
      hintText="Seleccionar"
      hintStyle={{ color: '#FC9900', fontSize: '16px' }}
      floatingLabelFixed
      autoWidth={false}
      underlineStyle={{ borderBottom: '1px solid #FC9900' }}
      iconStyle={{ fill: '#FC9900' }}
    >
      <MenuItem value="string" primaryText="String" />
      <MenuItem value="int" primaryText="Int" />
      <MenuItem value="decimal" primaryText="Decimal" />
      <MenuItem value="date" primaryText="Date" />
    </SelectField>
  );
};

const renderParameterAllowsNullCheckBox = (props, parameterUuId, fieldUuId, handleChangeCheckboxAllowNull) => {
  return (
    <Checkbox
      label="Permitir nulo"
      checked={props.allowNull}
      labelStyle={{ color: '#AAA', fontSize: '16px' }}
      onCheck={handleChangeCheckboxAllowNull}
    />
  );
};

const renderParameterOptionsSourceButton = (props, paramId, parameterUuId, displayOptionsSourceDialog, optionsSourceDialogHandlers) => {
  return (
    <div style={{ paddingRight: '20px' }}>
      <RaisedButton
        label={'OPCIONES'}
        backgroundColor={'rgb(170, 170, 170)'}
        labelStyle={{ color: 'white' }}
        onClick={optionsSourceDialogHandlers.handleShowOptionsSourceConfiguration}
        disabled={props.execute ? props.execute : false}
      />
    </div>
  );
};

@observer
class Parameter extends Component {

  constructor(props) {
    super(props);
    this.parameterUuId = Utils.getNewId();
    this.parameterNameUuId = Utils.getNewId();
    this.parameterLabelUuId = Utils.getNewId();
    this.parameterTypeUuId = Utils.getNewId();
    this.parameterValueUuId = Utils.getNewId();
    this.parameterAllowNullUuId = Utils.getNewId();
    this.state = {
      open: false,
      modalData: { type: 'string', name: '' },
      validated: false
    };
  }
  handleChangeInputName = (value) => {
    this.props.handleChangeInputName(this.props.id, value, this.parameterNameUuId);
  }
  handleChangeInputLabel = (value) => {
    this.props.handleChangeInputLabel(this.props.id, value, this.parameterLabelUuId);
  }
  handleChangeInputValue = (value) => {
    this.props.handleChangeInputValue(this.props.id, value);
  }
  handleChangeType = (event, key, type) => {
    this.props.handleChangeSelect(this.props.id, type);
  }
  handleChangeAllowNull = (event, allowNull) => {
    this.props.handleChangeAllowNull(this.props.id, allowNull);
  }
  handleChangeOptionsSource = (event, optionsSourceId) => {
    this.props.handleChangeOptionsSource(this.props.id, optionsSourceId);
  }
  handleChangeOptionsSourceLabel = (event, optionsSourceLabel) => {
    this.props.handleChangeOptionsSourceLabel(this.props.id, optionsSourceLabel);
  }
  handleChangeOptionsSourceValue = (event, optionsSourceValue) => {
    this.props.handleChangeOptionsSourceValue(this.props.id, optionsSourceValue);
  }
  handleShowOptionsConfiguration = () => {
    this.props.setShowOptionsConfigDialog(this.props.id);
  };
  handleHideOptionsConfiguration = () => {
    this.props.setShowOptionsConfigDialog(false);
  };
  handleDelete = () => {
    this.props.handleRemove(this.props.id, this.parameterUuId);
  }
  optionsSourceDialogHandlers = {
    handleShowOptionsSourceConfiguration: this.handleShowOptionsConfiguration,
    handleHideOptionsSourceConfiguration: this.handleHideOptionsConfiguration,
    handleChangeOptionsSource: this.handleChangeOptionsSource,
    handleChangeOptionsSourceLabel: this.handleChangeOptionsSourceLabel,
    handleChangeOptionsSourceValue: this.handleChangeOptionsSourceValue
  };
  render() {
    const disabledOnEdit = this.props.edit || false;
    /*let cssClass = 'parameter';
    if (this.props.validationStore.errors.length !== 0) {
      const parameterErrors = this.props.validationStore.getParentErrors(this.parameterUuId);
      if (parameterErrors && parameterErrors.length > 0) {
        cssClass = `${cssClass}`;
      }
    }*/
    return (
      <WrapperFilterContent style={{ ...styles.filterContent }}>
        <div className={'parameter'}>
          <div className="name">{renderParameterNameInput(this.props, this.parameterUuId, this.parameterNameUuId, this.handleChangeInputName, this.handleBlurInputName)}</div>
          <div className="label">{renderParameterLabelInput(this.props, this.parameterUuId, this.parameterLabelUuId, this.handleChangeInputLabel, this.handleBlurInputLabel)}</div>
          <div className="select">{renderParameterTypeSelect(this.props, this.parameterUuId, this.parameterTypeUuId, this.handleChangeType)}</div>
          <div className="value">{renderParameterValueInput(this.props, this.parameterUuId, this.parameterValueUuId, this.handleChangeInputValue)}</div>
          <div className="check">{renderParameterAllowsNullCheckBox(this.props, this.parameterUuId, this.parameterAllowNullUuId, this.handleChangeAllowNull)}</div>
          <div style={{ flexDirection: 'row', width: '33.23%', display: 'flex', alignItems: 'center' }}>
            {renderParameterOptionsSourceButton(this.props, this.props.id, this.parameterUuId, this.props.displayOptionsSourceDialog, this.optionsSourceDialogHandlers)}
            <div style={{ paddingRight: '20px' }}>
              <DeleteIcon
                onClick={this.handleDelete}
                disabled={disabledOnEdit}
                style={{ ...styles.iconsBG }}
              />
            </div>
          </div>
        </div>
      </WrapperFilterContent>
    );
  }
}

export default Parameter;
