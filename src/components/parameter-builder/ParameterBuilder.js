import React, { Component } from 'react';
import { observer } from 'mobx-react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Utils from '../../utils';
import Parameter from './Parameter';
import { ParameterOptionsSource } from './stores/ParameterStore';
import './ParameterBuilder.css';

@observer
class ParameterBuilder extends Component {
  constructor(props) {
    super(props);
    this.parameterIndex = 0;
    this.validationStore = this.props.validationStore;
  }
  setShowOptionsConfigDialog = (parameterId) => {
    this.props.store.setSourcesEdittingParameter(parameterId);
  }
  optionsSourceDialogActions = [
    <FlatButton
      label="Cerrar"
      primary
      onClick={() => { this.props.store.setSourcesEdittingParameter(undefined); }}
    />,
  ];
  handleChangeInputValue = (parameterId, value, fieldId) => {
    const parameter = this.props.store.findParameter(parameterId);
    if (parameter) {
      parameter.value = value;
    }
    if (fieldId) {
      this.props.validationStore.deleteFieldErrors(fieldId);
    }
  }
  handleChangeInputName = (parameterId, schemaName, fieldId) => {
    const parameter = this.props.store.findParameter(parameterId);
    if (parameter) {
      parameter.name = schemaName;
    }
    if (fieldId) {
      this.props.validationStore.deleteFieldErrors(fieldId);
    }
  };
  handleChangeInputLabel = (parameterId, label, fieldId) => {
    const parameter = this.props.store.findParameter(parameterId);
    if (parameter) {
      parameter.label = label;
    }
    if (fieldId) {
      this.props.validationStore.deleteFieldErrors(fieldId);
    }
  }
  handleChangeSelectType = (parameterId, type) => {
    const parameter = this.props.store.findParameter(parameterId);
    if (parameter) {
      parameter.type = type;
    }
  }
  handleChangeAllowNullCheckbox = (parameterId, allowNull) => {
    const parameter = this.props.store.findParameter(parameterId);
    if (parameter) {
      parameter.allowNull = allowNull;
      parameter.value = null;
    }
  }
  handleChangeOptionsSourceId = (parameterId, optionsSourceId) => {
    const parameter = this.props.store.findParameter(parameterId);
    if (parameter) {
      if (parameter.optionsSource) {
        parameter.optionsSource.sourceId = optionsSourceId;
        parameter.optionsSource.labelProperty = undefined;
        parameter.optionsSource.valueProperty = undefined;
      } else {
        parameter.optionsSource = new ParameterOptionsSource(optionsSourceId, undefined, undefined);
      }
      parameter.optionsSource.source = this.props.sources.find((source) => { return source.id === optionsSourceId; });
      this.props.store.setSourcesEdittingParameter(undefined, parameter);
    }
  }
  handleChangeOptionsSourceLabel = (parameterId, optionsSourceLabel) => {
    const parameter = this.props.store.findParameter(parameterId);
    if (parameter) {
      if (parameter.optionsSource) {
        parameter.optionsSource.labelProperty = optionsSourceLabel;
      } /*else {
        parameter.optionsSource = new ParameterOptionsSource(undefined, optionsSourceLabel, undefined);
      }*/
      this.props.store.setSourcesEdittingParameter(undefined, parameter);
    }
  }
  handleChangeOptionsSourceValue = (parameterId, optionsSourceValue) => {
    const parameter = this.props.store.findParameter(parameterId);
    if (parameter) {
      if (parameter.optionsSource) {
        parameter.optionsSource.valueProperty = optionsSourceValue;
      } /*else {
        parameter.optionsSource = new ParameterOptionsSource(undefined, undefined, optionsSourceValue);
      }*/
      this.props.store.setSourcesEdittingParameter(undefined, parameter);
    }
  }
  addParameter = () => {
    const newParameter = { id: Utils.getNewId(), name: null, label: null, type: 'string', value: null, requireOnExecution: false, allowNull: false };
    this.props.store.addParameter(newParameter);
  }
  removeParameter = (parameterId, parameterUuId) => {
    this.props.store.removeParameter(parameterId);
    this.props.validationStore.deleteParentErrors(parameterUuId);
    this.props.handleRemoveParameter();
  }
  render() {
    return (
      <div>
        <div>
          <div className="parameters">
            {this.props.parameters.map((parameter, index) => {
              return (<Parameter
                {...parameter}
                key={index}
                edit={this.props.edit || false}
                validationStore={this.validationStore}
                handleChangeInputName={this.handleChangeInputName}
                handleChangeInputLabel={this.handleChangeInputLabel}
                handleChangeInputValue={this.handleChangeInputValue}
                handleChangeSelect={this.handleChangeSelectType}
                handleChangeAllowNull={this.handleChangeAllowNullCheckbox}
                handleChangeOptionsSource={this.handleChangeOptionsSourceId}
                handleChangeOptionsSourceLabel={this.handleChangeOptionsSourceLabel}
                handleChangeOptionsSourceValue={this.handleChangeOptionsSourceValue}
                handleRemove={this.removeParameter}
                displayOptionsSourceDialog={this.props.store.showOptionsConfigDialog}
                setShowOptionsConfigDialog={this.setShowOptionsConfigDialog}
                sources={this.props.sources}
              />);
            })}
          </div>
          {/* <div style={{ margin: '15px' }}>
            <div style={{ borderTop: '2px solid #315698' }} />
          </div> */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {this.props.execute ?
              null :
              <RaisedButton
                label="Agregar Filtro"
                primary
                onClick={this.addParameter}
                backgroundColor={'rgb(170, 170, 170)'}
                labelStyle={{ color: 'white' }}
                style={{ marginRight: '25px', marginTop: '15px', marginBottom: '10px' }}
              /> }
          </div>
        </div>
        {this.props.store.sourcesEdittingParameter && <Dialog
          title="Opciones"
          actions={this.optionsSourceDialogActions}
          modal
          open={!!this.props.store.sourcesEdittingParameter}
        >
          <SelectField
            floatingLabelText="Origen de datos"
            value={this.props.store.sourcesEdittingParameter && this.props.store.sourcesEdittingParameter.optionsSource ? this.props.store.sourcesEdittingParameter.optionsSource.sourceId : undefined}
            hintStyle={{ color: '#FC9900', fontSize: '16px' }}
            underlineStyle={{ borderBottom: '1px solid #FC9900' }}
            iconStyle={{ fill: '#FC9900' }}
            floatingLabelStyle={{ color: '#AAAAAA', fontSize: '14px' }}
            onChange={(event, index, value) => { return this.handleChangeOptionsSourceId(this.props.store.sourcesEdittingParameter.id, value); }}
            fullWidth
          >
            {/* <MenuItem value={undefined} primaryText={'Seleccione origen'} /> */}
            {this.props.sources.map((source) => {
              return <MenuItem key={source.id} value={source.id} primaryText={source.name} />;
            })}
          </SelectField>
          <SelectField
            floatingLabelText="Etiqueta"
            value={this.props.store.sourcesEdittingParameter && this.props.store.sourcesEdittingParameter.optionsSource ? this.props.store.sourcesEdittingParameter.optionsSource.labelProperty : undefined}
            hintStyle={{ color: '#FC9900', fontSize: '16px' }}
            underlineStyle={{ borderBottom: '1px solid #FC9900' }}
            iconStyle={{ fill: '#FC9900' }}
            floatingLabelStyle={{ color: '#AAAAAA', fontSize: '14px' }}
            disabled={!this.props.store.sourcesEdittingParameter || !this.props.store.sourcesEdittingParameter.optionsSource || !this.props.store.sourcesEdittingParameter.optionsSource.source}
            onChange={(event, index, value) => { return this.handleChangeOptionsSourceLabel(this.props.store.sourcesEdittingParameter.id, value); }}
            fullWidth
          >
            {/* <MenuItem value={undefined} primaryText={'Seleccione propiedad'} /> */}
            {
              this.props.store.sourcesEdittingParameter && this.props.store.sourcesEdittingParameter.optionsSource ? this.props.store.sourcesEdittingParameter.optionsSource.source.schema.map((field) => {
                return <MenuItem key={field.name} value={field.name} primaryText={field.name} />;
              }) : []
          }
          </SelectField>
          <SelectField
            floatingLabelText="Valor"
            value={this.props.store.sourcesEdittingParameter && this.props.store.sourcesEdittingParameter.optionsSource ? this.props.store.sourcesEdittingParameter.optionsSource.valueProperty : undefined}
            hintStyle={{ color: '#FC9900', fontSize: '16px' }}
            underlineStyle={{ borderBottom: '1px solid #FC9900' }}
            iconStyle={{ fill: '#FC9900' }}
            floatingLabelStyle={{ color: '#AAAAAA', fontSize: '14px' }}
            disabled={!this.props.store.sourcesEdittingParameter || !this.props.store.sourcesEdittingParameter.optionsSource || !this.props.store.sourcesEdittingParameter.optionsSource.source}
            onChange={(event, index, value) => { return this.handleChangeOptionsSourceValue(this.props.store.sourcesEdittingParameter.id, value); }}
            fullWidth
          >
            {/* <MenuItem value={undefined} primaryText={'Seleccione propiedad'} /> */}
            {
              this.props.store.sourcesEdittingParameter && this.props.store.sourcesEdittingParameter.optionsSource ? this.props.store.sourcesEdittingParameter.optionsSource.source.schema.map((field) => {
                return <MenuItem key={field.name} value={field.name} primaryText={field.name} />;
              }) : []
          }
          </SelectField>
        </Dialog>}
      </div>
    );
  }
}

export default ParameterBuilder;
