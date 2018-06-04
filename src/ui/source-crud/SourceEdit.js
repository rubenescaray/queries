import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
//import Checkbox from 'material-ui/Checkbox';
//import DeleteIcon from 'material-ui/svg-icons/action/delete';
import RaisedButton from 'material-ui/RaisedButton';
import SourceIcon from 'material-ui/svg-icons/action/dns';
import FavoriteBorderIcon from 'material-ui/svg-icons/action/favorite-border';
import VisibilityIcon from 'material-ui/svg-icons/action/visibility';
import styled from 'styled-components';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ReactTable from 'react-table';
import { Tabs, Tab } from 'material-ui/Tabs';
import 'react-table/react-table.css';
import Utils from '../../utils';
import SourceEditStore from './stores/SourceEditStore';
//import { Row, Column } from '../../components/layout/gridSystem';
import ParameterBuilder from '../../components/parameter-builder/ParameterBuilder';
import ParameterStore from '../../components/parameter-builder/stores/ParameterStore';
import ValidationStore from '../../components/validation/validationStore';
//import ValidationSummary from '../../components/validation/ValidationSummary';
import * as ValidationEngine from '../../components/validation/validationEngine';
import Palette from '../../Palette';

/*const style = {
  width: '100%',
  padding: '20px',
};*/

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

const WrapperTable = styled.div`
  // Small devices (phones, 320 to 768... less than 768px)
  @media (min-width: 320px) {
    width: 100%;
    float: none;
  }

  @media (min-width: 1280px) {
    width: 100%;
  }
`;

const styles = {
  wrapper: {
    //marginTop: '-15px',
  },
  sourceName: {
    color: Palette.infoCard.titleTextColor,
    fontSize: '24px',
    fontWeight: 'bold',
  },
  iconAndTitle: {
    display: 'flex',
    flexDirection: 'row',
    float: 'left',
  },
  infoCard: {
    backgroundColor: Palette.infoCard.backgroundColor,
    padding: '15px 15px 10px 15px',
    //height: 'auto',
    //minHeight: '120px',
    borderRadius: '4px',
    position: 'relative',
    height: '20%',
  },
  extraIcons: {
    display: 'flex',
    flexDirection: 'row',
    float: 'right',
    marginRight: '5px',
  },
  icons: {
    color: '#FFF',
    cursor: 'pointer',
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
  favoriteIcon: {
    backgroundColor: '#FFF',
    padding: '2px',
    borderRadius: '4px',
    color: Palette.infoCard.backgroundColor,
    cursor: 'pointer',
  },
  windowTitle: {
    color: '#777',
    fontWeight: 'bold',
    marginLeft: '30px',
    marginTop: '15px',
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
    color: '#FFF',
  },
  infoCardDetailTextBoxTitle: {
    color: '#7EAAE3',
    fontSize: '13px',
  },
  infoCardDetailTextBoxContainer: {
    width: '33%',
    marginLeft: '5px',
    paddingLeft: '5px',
    paddingRight: '5px',
    boxSizing: 'border-box',
  },
  filterContainer: {
    border: `1px solid ${Palette.palette.primaryDark}`,
    borderRadius: '4px',
    backgroundColor: '#FFF',
    paddingBottom: '5px',
    marginTop: '40px',
    overflow: 'auto',
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
    zIndex: '2000',
  },
  filterContent: {
    display: 'flex',
    flexDirection: 'row',
    padding: '15px 15px 0px 20px',
    backgroundColor: '#FFF',
    overflowY: 'auto',
    position: 'relative',
    marginBottom: '65px',
  },
  filterMainTitle: {
    color: Palette.parametersFilter.filterMainTitleTextColor,
    fontSize: '22px',
  },
  parameterValuesContainer: {

  },
  criteriaBuilderContainer: {

  },
  tableContainer: {

  },
};


@inject('sourceListStore')
@inject('snackBarStore')
@inject('sourceService')
@inject('catalogService')
@observer
class SourceEdit extends Component {
  constructor(props) {
    super(props);
    this.parameterStore = new ParameterStore();
    this.sourceEditStore = new SourceEditStore(this.props.sourceService, this.props.catalogService, this.props.snackBarStore, this.parameterStore, this.props.sourceListStore);
    this.validationStore = new ValidationStore();
    this.fieldsValidationProps = {
      nameValidationProps: {
        required: true,
        parentId: undefined,
        fieldId: Utils.getNewId(),
        name: 'Nombre',
        customErrorText: ''
      },
      descriptionValidationProps: {
        required: true,
        parentId: undefined,
        fieldId: Utils.getNewId(),
        name: 'Descripción',
        customErrorText: ''
      },
      commandValidationProps: {
        required: true,
        parentId: undefined,
        fieldId: Utils.getNewId(),
        name: 'Nombre de Comando',
        customErrorText: ''
      },
      catalogValidationProps: {
        required: true,
        parentId: undefined,
        fieldId: Utils.getNewId(),
        name: 'Catalogo',
        customErrorText: ''
      }
    };

    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.nameValidationProps);
    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.descriptionValidationProps);
    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.commandValidationProps);
    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.catalogValidationProps);
  }

  componentDidMount() {
    this.sourceEditStore.fetchCatalogs();
    this.sourceEditStore.getSource(this.props.params.id);
    this.sourceEditStore.fetchSources(true);
  }

  handleNameChange = (props, e) => {
    this.sourceEditStore.name = e.target.value;
    ValidationEngine.validateRules(this.validationStore, e.target.value, props.parentId, props.fieldId, props.name);
  }

  handleDescriptionChange = (props, e) => {
    this.sourceEditStore.description = e.target.value;
    ValidationEngine.validateRules(this.validationStore, e.target.value, props.parentId, props.fieldId, props.name);
  }

  handleCommandChange = (props, e) => {
    this.sourceEditStore.command = e.currentTarget.value;
    ValidationEngine.validateRules(this.validationStore, e.currentTarget.value, props.parentId, props.fieldId, props.name);
    this.sourceEditStore.clearSchemaAndResults();
  }

  handleCatalogChange = (props, value) => {
    this.sourceEditStore.catalog = value;
    ValidationEngine.validateRules(this.validationStore, value, props.parentId, props.fieldId, props.name);
  }

  preventSpace(e) {
    if (e.charCode === 32) {
      e.preventDefault();
    }
  }

  handleChangeParamenter = () => {
    this.sourceEditStore.clearResults();
  }

  handleRemoveParameter = () => {
    this.sourceEditStore.clearResults();
  }

  test = () => {
    this.sourceEditStore.testSource({
      command: this.sourceEditStore.command,
      parameters: this.parameterStore.parameters,
      catalog: this.sourceEditStore.catalog
    });
  }

  isValid = () => {
    return (
      this.validationStore.errors.length === 0
      && this.sourceEditStore.name !== ''
      && this.sourceEditStore.description !== ''
      && this.sourceEditStore.command !== ''
      && this.sourceEditStore.schema.length > 0
    );
  }

  testSchemas = () => {
    let result = false;
    if (this.sourceEditStore.schema.length === this.sourceEditStore.oldSchema.length) {
      if (JSON.stringify(this.sourceEditStore.schema.slice()) === JSON.stringify(this.sourceEditStore.oldSchema.slice())) {
        result = true;
      } else {
        result = false;
      }
    } else {
      result = false;
    }
    return result;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.testSchemas) {
      this.sourceEditStore.updateSource({
        id: this.sourceEditStore.id,
        name: this.sourceEditStore.name,
        description: this.sourceEditStore.description,
        command: this.sourceEditStore.command,
        type: this.sourceEditStore.type,
        parameters: this.parameterStore.parameters,
        schema: this.sourceEditStore.schema,
        catalog: this.sourceEditStore.catalog
      });
      this.props.router.push('/sources/index');
    } else {
      this.sourceEditStore.snackBarStore.setMessage('El esquema no se puede modificar');
    }
  }

  render() {
    //const results = this.sourceEditStore.results;
    const gridColumns = this.sourceEditStore.schema.map((s) => {
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
    } else {
      this.fieldsValidationProps.nameValidationProps.customErrorText = undefined;
      this.fieldsValidationProps.nameValidationProps.customErrorText = undefined;
      this.fieldsValidationProps.commandValidationProps.customErrorText = undefined;
      this.fieldsValidationProps.catalogValidationProps.customErrorText = undefined;
    }
    return (
      <div>
        <div style={styles.windowTitle}>
          EDITAR ORIGEN DE DATOS
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Paper style={styles.infoCard}>
            <div>
              <div style={styles.iconAndTitle}>
                <div>
                  <SourceIcon style={{ ...styles.icons, paddingTop: '2px' }} />
                </div>
                <div style={{ marginLeft: '20px' }}>
                  <label style={styles.sourceName}>{this.sourceEditStore.name !== null ? this.sourceEditStore.name : ''}</label>
                </div>
              </div>
              <div style={styles.extraIcons}>
                <div>
                  <FavoriteBorderIcon style={{ ...styles.favoriteIcon }} />
                </div>
              </div>
              <div style={{ clear: 'both' }} />
            </div>
            <div style={styles.infoCardDetail}>
              <div style={styles.infoCardDetailTextBoxContainer}>
                <div style={styles.infoCardDetailTextBoxTitle}>
                  DESCRIPCIÓN
                </div>
                <div>
                  <TextField
                    fullWidth
                    underlineDisabledStyle={{ borderBottom: '1px solid #7EAAE3' }}
                    value={this.sourceEditStore.description}
                    labelStyle={{ color: '#FFF' }}
                    errorText={this.fieldsValidationProps.descriptionValidationProps.customErrorText}
                    onChange={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                    onBlur={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                    inputStyle={{ ...styles.infoCardTextBox }}
                  />
                </div>
              </div>

              <div style={styles.infoCardDetailTextBoxContainer}>
                <div style={styles.infoCardDetailTextBoxTitle}>
                  NOMBRE DEL COMANDO
                </div>
                <div>
                  <TextField
                    fullWidth
                    underlineDisabledStyle={{ borderBottom: '1px solid #7EAAE3' }}
                    value={this.sourceEditStore.command}
                    errorText={this.fieldsValidationProps.commandValidationProps.customErrorText}
                    onChange={(e) => { this.handleCommandChange(this.fieldsValidationProps.commandValidationProps, e); }}
                    onBlur={(e) => { this.handleCommandChange(this.fieldsValidationProps.commandValidationProps, e); }}
                    onKeyPress={(e) => { this.preventSpace(e); }}
                    inputStyle={{ ...styles.infoCardTextBox }}
                  />
                </div>
              </div>
              <div style={styles.infoCardDetailTextBoxContainer}>
                <div style={styles.infoCardDetailTextBoxTitle}>
                  NOMBRE DEL CATALOGO
                </div>
                <div>
                  <SelectField
                    fullWidth
                    value={this.sourceEditStore.catalog}
                    underlineDisabledStyle={{ borderBottom: '1px solid #7EAAE3' }}
                    errorText={this.fieldsValidationProps.catalogValidationProps.customErrorText}
                    labelStyle={{ color: '#FFF' }}
                    onChange={(event, index, value) => { this.handleCatalogChange(this.fieldsValidationProps.catalogValidationProps, value); }}
                    //inputStyle={{ ...styles.infoCardTextBox }}
                  >
                    {this.sourceEditStore.catalogs.map((catalog) => {
                      return <MenuItem key={catalog} value={catalog} primaryText={catalog} />;
                    })
                  }
                  </SelectField>
                </div>
              </div>
            </div>
          </Paper>
        </div>
        <WrapperFilter style={styles.filterContainer}>
          <Tabs inkBarStyle={{ background: Palette.palette.primaryDark, overflow: 'auto' }}>
            <Tab label="Filtros" style={{ backgroundColor: Palette.palette.primaryLight, color: '#FFF', overflow: 'auto' }}>
              <ParameterBuilder
                //edit
                sources={this.sourceEditStore.sources}
                parameters={this.parameterStore.parameters}
                store={this.parameterStore}
                validationStore={this.validationStore}
                schema={this.sourceEditStore.oldSchema}
                handleRemoveParameter={this.handleRemoveParameter}
              />
            </Tab>
          </Tabs>
        </WrapperFilter>
        <div style={{ ...styles.backBottom, float: 'left' }}>
          <FlatButton label="« VOLVER A ORIGEN DE DATOS" onClick={() => { this.props.router.push('/sources/index'); }} />
        </div>

        <div style={{ float: 'right', marginBottom: '15px', marginTop: '15px' }}>
          <RaisedButton
            label="VISTA PREVIA"
            icon={<VisibilityIcon />}
            backgroundColor="#F5683A"
            labelColor="#FFF"
            buttonStyle={{ width: '150px', borderRadius: 25 }}
            style={{ borderRadius: 25 }}
            onClick={this.test}
          />
        </div>
        <WrapperTable style={styles.tableContainer}>
          <div className="horizontal-table">
            <ReactTable
              loading={this.sourceEditStore.fetching}
              data={this.sourceEditStore.results}
              columns={gridColumns}
              //pivotBy={pivot}
              showPagination={false}
              //expanded={this.queryEditStore.expandedRows}
              //onExpandedChange={(newExpanded, index, event) => { this.onExpandedChange(newExpanded, index, event); }}
              previousText="« Ant"
              nextText="Sig »"
              pageText="Pág."
              style={{ minHeight: '500px' }}
            />
          </div>
        </WrapperTable>
        <div style={{ marginTop: '50px' }}>
          <div>
            <div style={{ borderTop: '2px solid #315698', marginTop: '15px' }} />
          </div>
          <div style={{ marginTop: '50px' }}>
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
        </div>
        <div style={{ clear: 'both' }} />
        {/*<div>
          <ValidationSummary errors={this.validationStore.errors} />
          <h2>Editar Origenes de Datos</h2>
          <Paper style={style}>
            <form onSubmit={this.handleSubmit}>
              <Row>
                <Column>
                  <TextField
                    hintText="Nombre del Origen de Datos"
                    floatingLabelText="Nombre"
                    fullWidth
                    value={this.sourceEditStore.name}
                    errorText={this.fieldsValidationProps.nameValidationProps.customErrorText}
                    onChange={(e) => { this.handleNameChange(this.fieldsValidationProps.nameValidationProps, e); }}
                    onBlur={(e) => { this.handleNameChange(this.fieldsValidationProps.nameValidationProps, e); }}
                  />
                </Column>
                <Column>
                  <TextField
                    hintText="Descripción del Origen"
                    floatingLabelText="Descripción"
                    fullWidth
                    value={this.sourceEditStore.description}
                    errorText={this.fieldsValidationProps.descriptionValidationProps.customErrorText}
                    onChange={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                    onBlur={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                  />
                </Column>
                <Column>
                  <TextField
                    hintText="Comando SQL a Ejecutar"
                    floatingLabelText="Nombre de Comando"
                    fullWidth
                    value={this.sourceEditStore.command}
                    errorText={this.fieldsValidationProps.commandValidationProps.customErrorText}
                    onChange={(e) => { this.handleCommandChange(this.fieldsValidationProps.commandValidationProps, e); }}
                    onBlur={(e) => { this.handleCommandChange(this.fieldsValidationProps.commandValidationProps, e); }}
                    onKeyPress={(e) => { this.preventSpace(e); }}
                  />
                </Column>
                <Column>
                  <SelectField
                    floatingLabelText="Catalogo"
                    fullWidth
                    value={this.sourceEditStore.catalog}
                    errorText={this.fieldsValidationProps.catalogValidationProps.customErrorText}
                    onChange={(event, index, value) => { this.handleCatalogChange(this.fieldsValidationProps.catalogValidationProps, value); }}
                  >
                    {this.sourceEditStore.catalogs.map((catalog) => {
                      return <MenuItem key={catalog} value={catalog} primaryText={catalog} />;
                    })
                  }
                  </SelectField>
                </Column>
              </Row>
              <br />
              <h4>Parametros de Entrada</h4>
              <ParameterBuilder
                //edit
                sources={this.sourceEditStore.sources}
                parameters={this.parameterStore.parameters}
                store={this.parameterStore}
                validationStore={this.validationStore}
                schema={this.sourceEditStore.oldSchema}
                handleRemoveParameter={this.handleRemoveParameter}
              />
              <br />
              <RaisedButton
                label="Vista Previa"
                primary
                type="button"
                onClick={this.test}
              />
              <br />
              <div className="horizontal-table">
                {gridColumns.length > 0 &&
                  <ReactTable
                    loading={this.sourceEditStore.fetching}
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
              />
            </form>
          </Paper>
        </div>*/}
      </div>
    );
  }
}

export default SourceEdit;
