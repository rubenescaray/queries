import React, { Component } from 'react';
import 'whatwg-fetch';
import Paper from 'material-ui/Paper';
//import Checkbox from 'material-ui/Checkbox';
//import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import ReactTable from 'react-table';
//import DeleteIcon from 'material-ui/svg-icons/action/delete';
import { Tabs, Tab } from 'material-ui/Tabs';
//import AutorenewIcon from 'material-ui/svg-icons/action/autorenew';
import EyeIcon from 'material-ui/svg-icons/image/remove-red-eye';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
//import ModeEditIcon from 'material-ui/svg-icons/editor/mode-edit';
//import AutoComplete from 'material-ui/AutoComplete';
import QueryIcon from 'material-ui/svg-icons/action/chrome-reader-mode';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
//import ReactTable from 'react-table';
import Utils from '../../utils';
import ParameterBuilder from '../../components/parameter-builder/ParameterBuilder';
//import { Row, Column } from '../../components/layout/gridSystem';
import SourceFormStore from './stores/SourceFormStore';
import ParameterStore from '../../components/parameter-builder/stores/ParameterStore';
import ValidationStore from '../../components/validation/validationStore';
//import TextFieldIcon from '../../components/inputs/TextFieldIcon';
import * as ValidationEngine from '../../components/validation/validationEngine';
import Palette from '../../Palette';

const WrapperFilter = styled.div`
  // Small devices (phones, 320 to 768... less than 768px)
  @media (min-width: 320px) {
    width: 100%;
    height: auto;
    float: none;
  }

  @media (min-width: 1280px) {
    width: 100%;
  }
`;

/*const WrapperFilterContent = styled.div`
  // Small devices (phones, 320 to 768... less than 768px)
  @media (min-width: 320px) {
    height: auto;
    overflow: auto;
    max-height: 500px;
  }

  @media (min-width: 1280px) {
    height: 100px;
  }
`;*/

const styles = {
  wrapper: {
    marginTop: '-15px',
  },
  sourceName: {
    color: '#FC9900',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  iconAndTitle: {
    display: 'flex',
    flexDirection: 'row',
    float: 'left',
  },
  infoCard: {
    backgroundColor: '#FFF',
    padding: '15px 15px 10px 15px',
    borderRadius: '4px',
    position: 'relative',
    height: '20%',
  },
  icons: {
    color: Palette.palette.primaryDark,
    cursor: 'pointer',
    paddingLeft: '10px'
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
  windowTitle: {
    color: '#777',
    fontWeight: 'bold',
    marginLeft: '30px',
    boxSizing: 'border-box',
    fontSize: '14px',
    paddingBottom: '10px',
    marginTop: '15px'
  },
  cardTitle: {
    color: '#777',
    marginLeft: '13px',
    boxSizing: 'border-box',
    fontSize: '14px',
    paddingBottom: '10px',
  },
  backBottom: {
    color: '#999',
    fontWeight: 'bold',
    marginLeft: '10px',
    boxSizing: 'border-box',
    fontSize: '14px',
    marginBottom: '15px',
    marginTop: '15px',
  },
  infoCardDetail: {
    display: 'flex',
    width: '100%',
    marginTop: '10px',
    marginLeft: '-5px',
  },
  infoCardTextBox: {
    fontSize: '18px',
    color: '#FC9900',
  },
  infoCardDetailTextBoxTitle: {
    color: '#AAAAAA',
    fontSize: '15px',
  },
  infoCardDetailTextBoxContainer: {
    width: '33%',
    marginLeft: '5px',
    paddingLeft: '5px',
    paddingRight: '5px',
    boxSizing: 'border-box',
  },
  filterHeader: {
    backgroundColor: Palette.parametersFilter.backgroundColor,
    color: '#FFF',
    padding: '15px 15px 15px 20px',
  },
  filterFooter: {
    backgroundColor: Palette.parametersFilter.backgroundColorFooter,
    position: 'absolute',
    bottom: '0',
    width: '100%',
    zIndex: '1000',
  },
  filterMainTitle: {
    color: Palette.parametersFilter.filterMainTitleTextColor,
    fontSize: '22px',
  },
  tableContainer: {
    float: 'right',
    marginTop: '-20px',
  },
  parameterValuesContainer: {

  },
  criteriaBuilderContainer: {

  },
  backButton: {
    color: '#999',
    fontWeight: 'bold',
    marginLeft: '10px',
    boxSizing: 'border-box',
    fontSize: '14px',
    marginBottom: '15px',
    marginTop: '15px',
  },
  filterContainer: {
    border: `1px solid ${Palette.palette.primaryDark}`,
    borderRadius: '4px',
    backgroundColor: '#FFF',
    paddingBottom: '5px',
    marginTop: '40px',
    overflow: 'auto',
  },
  filterContent: {
    padding: '15px 15px 0px 20px',
    backgroundColor: '#FFF',
    marginBottom: '65px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  underlineStyle: {
    borderColor: 'black'
  },
};

@inject('sourceListStore')
@inject('snackBarStore')
@inject('sourceService')
@inject('catalogService')
@inject('categoryService')
@observer
class SourceForm extends Component {
  constructor(props) {
    super(props);
    this.sourceFormStore = new SourceFormStore(this.props.sourceService, this.props.catalogService, this.props.categoryService, this.props.snackBarStore);
    this.validationStore = new ValidationStore();
    this.parameterStore = new ParameterStore();
    this.fieldsValidationProps = {
      nameValidationProps: {
        required: true,
        parentId: undefined,
        fieldId: Utils.getNewId(),
        name: 'fldName'
      },
      descriptionValidationProps: {
        required: true,
        parentId: undefined,
        fieldId: Utils.getNewId(),
        name: 'fldDescription'
      },
      commandValidationProps: {
        required: true,
        parentId: undefined,
        fieldId: Utils.getNewId(),
        name: 'fldCommand'
      },
      catalogValidationProps: {
        required: true,
        parentId: undefined,
        fieldId: Utils.getNewId(),
        name: 'fldCatalog'
      },
      entryValidationProps: {
        required: true,
        parentId: undefined,
        fieldId: Utils.getNewId(),
        name: 'fldEntry'
      }
    };

    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.nameValidationProps);
    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.descriptionValidationProps);
    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.commandValidationProps);
    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.catalogValidationProps);
  }
  componentDidMount = () => {
    this.sourceFormStore.fetchCatalogs();
    this.sourceFormStore.fetchEntries();
    Object.values(this.fieldsValidationProps).forEach((validationProp) => {
      ValidationEngine.validateRules(this.validationStore, '', validationProp.parentId, validationProp.fieldId, validationProp.name);
    });
    this.sourceFormStore.fetchSources(true);
  }
  handleNameChange = (props, e) => {
    const value = e.target.value;
    if (ValidationEngine.validateRules(this.validationStore, value, props.parentId, props.fieldId, props.name)) {
      this.sourceFormStore.name = value;
    }
  }
  handleDescriptionChange = (props, e) => {
    const value = e.target.value;
    if (ValidationEngine.validateRules(this.validationStore, value, props.parentId, props.fieldId, props.name)) {
      this.sourceFormStore.description = value;
    }
  }
  handleCommandChange = (props, e) => {
    const value = e.target.value;
    if (ValidationEngine.validateRules(this.validationStore, value, props.parentId, props.fieldId, props.name)) {
      this.sourceFormStore.command = value;
    }
    this.sourceFormStore.clearSchemaAndResults();
  }
  handleCatalogChange = (props, value) => {
    if (ValidationEngine.validateRules(this.validationStore, value, props.parentId, props.fieldId, props.name)) {
      this.sourceFormStore.catalog = value;
    }
  }
  handleChangeEntry = (props, value) => {
    if (ValidationEngine.validateRules(this.validationStore, value, props.parentId, props.fieldId, props.name)) {
      this.sourceFormStore.entry = value;
    }
  }
  preventSpace(e) {
    if (e.charCode === 32) {
      e.preventDefault();
    }
  }
  handleChangeParamenter = () => {
    this.sourceFormStore.clearResults();
  }
  handleRemoveParameter = () => {
    this.sourceFormStore.clearResults();
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.sourceListStore.add({
      name: this.sourceFormStore.name,
      description: this.sourceFormStore.description,
      command: this.sourceFormStore.command,
      type: 'sql',
      parameters: this.parameterStore.parameters,
      schema: this.sourceFormStore.schema,
      catalog: this.sourceFormStore.catalog
    });
    this.props.router.push('/sources/index');
  }
  test = () => {
    this.sourceFormStore.testSource({
      command: this.sourceFormStore.command,
      parameters: this.parameterStore.parameters,
      catalog: this.sourceFormStore.catalog
    });
  }
  isValid = () => {
    return (this.validationStore.errors.length === 0
      && this.sourceFormStore.name !== ''
      && this.sourceFormStore.description !== ''
      && this.sourceFormStore.command !== ''
      && this.sourceFormStore.schema.length > 0);
  }
  render() {
    const results = this.sourceFormStore.results;
    const sources = this.sourceFormStore.sources;
    const gridColumns = this.sourceFormStore.schema.map((s) => {
      return {
        Header: s.name,
        accessor: s.name,
        minWidth: 150,
        maxWidth: undefined
      };
    });
    if (this.validationStore.errors.length !== 0) {
      const nameFieldErrors = this.validationStore.getFieldErrors(this.fieldsValidationProps.nameValidationProps.fieldId);
      if (nameFieldErrors && nameFieldErrors.errors.length > 0) {
        this.fieldsValidationProps.nameValidationProps.customErrorText = ' ';
      } else {
        this.fieldsValidationProps.nameValidationProps.customErrorText = undefined;
      }
      const descriptionFieldErrors = this.validationStore.getFieldErrors(this.fieldsValidationProps.descriptionValidationProps.fieldId);
      if (descriptionFieldErrors && descriptionFieldErrors.errors.length > 0) {
        this.fieldsValidationProps.descriptionValidationProps.customErrorText = ' ';
      } else {
        this.fieldsValidationProps.descriptionValidationProps.customErrorText = undefined;
      }
      const commandFieldErrors = this.validationStore.getFieldErrors(this.fieldsValidationProps.commandValidationProps.fieldId);
      if (commandFieldErrors && commandFieldErrors.errors.length > 0) {
        this.fieldsValidationProps.commandValidationProps.customErrorText = ' ';
      } else {
        this.fieldsValidationProps.commandValidationProps.customErrorText = undefined;
      }
      const catalogFieldErrors = this.validationStore.getFieldErrors(this.fieldsValidationProps.catalogValidationProps.fieldId);
      if (catalogFieldErrors && catalogFieldErrors.errors.length > 0) {
        this.fieldsValidationProps.catalogValidationProps.customErrorText = ' ';
      } else {
        this.fieldsValidationProps.catalogValidationProps.customErrorText = undefined;
      }
      const entryFieldErrors = this.validationStore.getFieldErrors(this.fieldsValidationProps.entryValidationProps.fieldId);
      if (entryFieldErrors && entryFieldErrors.errors.length > 0) {
        this.fieldsValidationProps.entryValidationProps.customErrorText = ' ';
      } else {
        this.fieldsValidationProps.entryValidationProps.customErrorText = undefined;
      }
    } else {
      this.fieldsValidationProps.nameValidationProps.customErrorText = undefined;
      this.fieldsValidationProps.descriptionValidationProps.customErrorText = undefined;
      this.fieldsValidationProps.commandValidationProps.customErrorText = undefined;
      this.fieldsValidationProps.catalogValidationProps.customErrorText = undefined;
      this.fieldsValidationProps.entryValidationProps.customErrorText = undefined;
    }
    return (
      <div>
        <div style={styles.windowTitle}>
          AGREGAR ORIGEN DE DATOS
        </div>
        <form onSubmit={this.handleSubmit}>
          <Paper style={styles.infoCard}>
            <div>
              <div style={styles.cardTitle}>
                NOMBRE DEL ORIGEN DE DATOS
              </div>
              <div style={{ ...styles.iconAndTitle, width: '99%' }}>
                <div>
                  <QueryIcon style={{ ...styles.icons, paddingTop: '5px', width: 35, height: 35 }} />
                </div>
                <div style={{ marginLeft: '20px', width: '100%' }}>
                  <TextField
                    fullWidth
                    hintText="Escriba el nombre"
                    hintStyle={{ ...styles.sourceName }}
                    underlineStyle={styles.underlineStyle}
                    inputStyle={{ ...styles.sourceName }}
                    errorText={this.fieldsValidationProps.nameValidationProps.customErrorText}
                    onChange={(e) => { this.handleNameChange(this.fieldsValidationProps.nameValidationProps, e); }}
                    onBlur={(e) => { this.handleNameChange(this.fieldsValidationProps.nameValidationProps, e); }}
                  />
                </div>
              </div>
              <div style={{ clear: 'both' }} />
            </div>

            <div style={styles.infoCardDetail}>
              <div style={styles.infoCardDetailTextBoxContainer}>
                <div>
                  <SelectField
                    floatingLabelText="ÁREA"
                    floatingLabelStyle={{ color: '#AAAAAA', fontSize: '20px' }}
                    hintText="Seleccione"
                    hintStyle={{ color: '#FC9900', fontSize: '20px' }}
                    floatingLabelFixed
                    value={this.sourceFormStore.entry}
                    fullWidth
                    underlineStyle={{ borderBottom: '1px solid #FC9900' }}
                    iconStyle={{ fill: '#FC9900' }}
                    onChange={(event, index, value) => { return this.handleChangeEntry(this.fieldsValidationProps.entryValidationProps, value); }}
                    labelStyle={{ color: '#FC9900' }}
                  >
                    {this.sourceFormStore.entries.map((entry) => {
                      return <MenuItem key={entry.id} value={entry.id} primaryText={entry.name} />;
                    })
                    }
                  </SelectField>
                </div>
              </div>

              <div style={styles.infoCardDetailTextBoxContainer}>
                <div>
                  <SelectField
                    floatingLabelText="CATALOGO"
                    floatingLabelStyle={{ color: '#AAAAAA', fontSize: '20px' }}
                    hintText="Seleccione"
                    hintStyle={{ color: '#FC9900', fontSize: '20px' }}
                    floatingLabelFixed
                    fullWidth
                    underlineStyle={{ borderBottom: '1px solid #FC9900' }}
                    iconStyle={{ fill: '#FC9900' }}
                    value={this.sourceFormStore.catalog}
                    onChange={(event, index, value) => { return this.handleCatalogChange(this.fieldsValidationProps.catalogValidationProps, value); }}
                    labelStyle={{ color: '#FC9900' }}
                  >
                    {this.sourceFormStore.catalogs.map((catalog) => {
                      return <MenuItem key={catalog} value={catalog} primaryText={catalog} />;
                    })
                    }
                  </SelectField>
                </div>
              </div>

              <div style={styles.infoCardDetailTextBoxContainer}>
                <TextField
                  hintText="Indique"
                  floatingLabelFixed
                  floatingLabelText="NOMBRE EL COMANDO"
                  fullWidth
                  underlineStyle={{ borderBottom: '1px solid #FC9900' }}
                  hintStyle={{ color: '#FC9900', fontSize: '20px' }}
                  floatingLabelStyle={{ color: '#AAAAAA', fontSize: '20px' }}
                  errorText={this.fieldsValidationProps.commandValidationProps.customErrorText}
                  onChange={(e) => { this.handleCommandChange(this.fieldsValidationProps.commandValidationProps, e); }}
                  onBlur={(e) => { this.handleCommandChange(this.fieldsValidationProps.commandValidationProps, e); }}
                  onKeyPress={(e) => { this.preventSpace(e); }}
                />
              </div>
            </div> {/* cierre de <div style={styles.infoCardDetail}> */}
            <div style={{ ...styles.infoCardDetail }}>
              <div style={{ ...styles.infoCardDetailTextBoxContainer, width: '70%' }}>
                <div>
                  <TextField
                    hintText="Escriba una breve descripción"
                    hintStyle={{ color: '#FC9900', fontSize: '20px' }}
                    floatingLabelStyle={{ color: '#AAAAAA', fontSize: '20px' }}
                    floatingLabelFixed
                    errorText={this.fieldsValidationProps.descriptionValidationProps.customErrorText}
                    fullWidth
                    inputStyle={{ color: '#FC9900' }}
                    underlineStyle={{ borderBottom: '1px solid #FC9900', width: '143%' }}
                    floatingLabelText="DESCRIPCIÓN"
                    onChange={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                    onBlur={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                  />
                </div>
              </div>
            </div>
            <WrapperFilter style={styles.filterContainer}>
              <Tabs inkBarStyle={{ background: Palette.palette.primaryDark }}>
                <Tab label="Filtros" style={{ backgroundColor: Palette.palette.primaryLight, color: '#FFF' }}>
                  <ParameterBuilder
                    parameters={this.parameterStore.parameters}
                    store={this.parameterStore}
                    validationStore={this.validationStore}
                    schema={this.sourceFormStore.schema}
                    sources={sources}
                    handleRemoveParameter={this.handleRemoveParameter}
                  />
                </Tab>
              </Tabs>
            </WrapperFilter>
            <div>
              <div style={{ ...styles.backButton, float: 'left' }}>
                <FlatButton label="« VOLVER A ORIGEN DE DATOS" onClick={() => { this.props.router.push('/sourceS/index'); }} />
              </div>

              <div style={{ float: 'right', marginBottom: '15px', marginTop: '15px' }}>
                <RaisedButton
                  label="VISTA PREVIA"
                  icon={<EyeIcon />}
                  backgroundColor="#F5683A"
                  labelColor="#FFF"
                  buttonStyle={{ width: '150px', borderRadius: 25 }}
                  style={{ borderRadius: 25 }}
                  onClick={() => {
                    this.test();
                  }
                  }
                />
              </div>
              <div className="horizontal-table">
                {gridColumns.length > 0 &&
                <ReactTable
                  loading={this.sourceFormStore.fetching}
                  data={results}
                  columns={gridColumns}
                  showPagination={false}
                  noDataText="No hay información de fuentes de datos"
                />
              }
              </div>
            </div>
            <div style={{ marginTop: '70px' }}>
              <div>
                <div style={{ borderTop: '2px solid #315698', marginTop: '15px' }} />
              </div>
              <div style={{ marginTop: '25px' }}>
                <div style={{ ...styles.backBottom, float: 'left' }}>
                  <RaisedButton
                    label="CANCELAR"
                    backgroundColor="rgb(204, 204, 204)"
                    buttonStyle={{ width: '150px' }}
                    onClick={() => { this.props.router.push('/sources/index'); }}
                  />
                </div>
                <div style={{ float: 'left', marginBottom: '15px', marginTop: '15px', marginLeft: '15px' }}>
                  <RaisedButton
                    label="GUARDAR DATOS"
                    backgroundColor="rgb(62, 115, 221)"
                    labelColor="#FFF"
                    buttonStyle={{ width: '150px' }}
                    onClick={(e) => { this.handleSubmit(e); }}
                  />
                </div>
              </div>
              <div style={{ clear: 'both' }} />
            </div>
          </Paper>
          {/*<Row>
            <Column>
              <div>
                <QueryIcon style={{ ...styles.icons, paddingTop: '2px', width: 30, height: 30 }} />
              </div>
              <TextField
                hintText="Nombre del Origen de Datos"
                floatingLabelFixed
                floatingLabelText="NOMBRE DEL ORIGEN DE DATOS"
                fullWidth
                errorText={this.fieldsValidationProps.nameValidationProps.customErrorText}
                onChange={(e) => { this.handleNameChange(this.fieldsValidationProps.nameValidationProps, e); }}
                onBlur={(e) => { this.handleNameChange(this.fieldsValidationProps.nameValidationProps, e); }}
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <TextField
                hintText="Descripción del Origen"
                floatingLabelFixed
                floatingLabelText="Descripción"
                fullWidth
                errorText={this.fieldsValidationProps.descriptionValidationProps.customErrorText}
                onChange={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                onBlur={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
              />
            </Column>
            <Column>
              <TextField
                hintText="Comando SQL a Ejecutar"
                floatingLabelFixed
                floatingLabelText="Nombre de Comando"
                fullWidth
                errorText={this.fieldsValidationProps.commandValidationProps.customErrorText}
                onChange={(e) => { this.handleCommandChange(this.fieldsValidationProps.commandValidationProps, e); }}
                onBlur={(e) => { this.handleCommandChange(this.fieldsValidationProps.commandValidationProps, e); }}
                onKeyPress={(e) => { this.preventSpace(e); }}
              />
            </Column>
            <Column>
              <SelectField
                floatingLabelText="Catálogo"
                hintText="Seleccione un Catálogo"
                floatingLabelFixed
                fullWidth
                value={this.sourceFormStore.catalog}
                errorText={this.fieldsValidationProps.catalogValidationProps.customErrorText}
                onChange={(event, index, value) => { this.handleCatalogChange(this.fieldsValidationProps.catalogValidationProps, value); }}
              >
                {this.sourceFormStore.catalogs.map((catalog) => {
                  return <MenuItem key={catalog} value={catalog} primaryText={catalog} />;
                })
              }
              </SelectField>
            </Column>
          </Row>
          <h4>Parametros de Entrada</h4>
          <ParameterBuilder
            parameters={this.parameterStore.parameters}
            store={this.parameterStore}
            validationStore={this.validationStore}
            schema={this.sourceFormStore.schema}
            sources={sources}
            handleRemoveParameter={this.handleRemoveParameter}
          />
          <br />
          <RaisedButton
            label="Vista Previa"
            primary
            onClick={this.test}
          />
          <br />
          <div className="horizontal-table">
            {gridColumns.length > 0 &&
              <ReactTable
                loading={this.sourceFormStore.fetching}
                data={results}
                columns={gridColumns}
                showPagination={false}
                noDataText="No hay información de fuentes de datos"
              />
            }
          </div>
          <br />
          <FlatButton label="Cancelar" onClick={() => { this.props.router.push('/sources/index'); }} />
          <RaisedButton
            label="Guardar"
            primary
            type="submit"
            disabled={!this.isValid()}
          />*/}
        </form>
      </div>
    );
  }
}

export default SourceForm;
