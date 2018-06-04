/* eslint no-param-reassign: ["error", { "props": false }]*/
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import { Tabs, Tab } from 'material-ui/Tabs';
import styled from 'styled-components';
import QueryIcon from 'material-ui/svg-icons/action/chrome-reader-mode';
import AutorenewIcon from 'material-ui/svg-icons/action/autorenew';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Utils from '../../utils';
import { defineColumns } from '../../components/table/columnsDefiner';
//import { sourceService, queryService } from '../../services/Services';
import QueryFormStore from './stores/QueryFormStore';
import CriteriaBuilder from '../../components/criteria-builder/CriteriaBuilder';
import CriteriaBuilderStore from '../../components/criteria-builder/stores/CriteriaBuilderStore';
import ValidationStore from '../../components/validation/validationStore';
import GroupByBuilder from '../../components/aggregation-builder/GroupByBuilder';
import FooterBuilder from '../../components/aggregation-builder/FooterBuilder';
import FooterStore from '../../components/aggregation-builder/stores/FooterStore';
import GroupByBuilderStore from '../../components/aggregation-builder/stores/GroupByBuilderStore';
import ParameterMapper from '../../components/parameter-mapper/ParameterMapper';
import ParameterMapperStore from '../../components/parameter-mapper/stores/ParameterMapperStore';
import ParameterValues from '../../components/parameter-values/ParameterValues';
import ParameterValuesStore from '../../components/parameter-values/stores/ParameterValuesStore';
import * as ValidationEngine from '../../components/validation/validationEngine';
import FormDetail from '../../components/form-detail/FormDetail';
import SelectFilter from '../../components/select-filter/SelectFilter';
import SelectFilterStore from '../../components/select-filter/stores/SelectFilterStore';
//import { Row, Column } from '../../components/layout/gridSystem';
import Palette from '../../Palette';

/*const style = {
  width: '100%',
  padding: '20px',
};

const operations = {
  marginTop: '20px',
  background: '#ffffff',
  padding: '10px',
};*/

const WrapperFilter = styled.div`
  // Small devices (phones, 320 to 768... less than 768px)
  @media (min-width: 320px) {
    width: 100%;
    height: auto;
    float: none;
  }

  @media (min-width: 1280px) {
    width: 39%;
    max-height: 500px;
  }
`;

const WrapperFilterContent = styled.div`
  // Small devices (phones, 320 to 768... less than 768px)
  @media (min-width: 320px) {
    height: auto;
    overflow: auto;
    max-height: 500px;
  }

  @media (min-width: 1280px) {
    height: 352px;
  }
`;

const WrapperTable = styled.div`
  // Small devices (phones, 320 to 768... less than 768px)
  @media (min-width: 320px) {
    width: 100%;
    float: none;
  }

  @media (min-width: 1280px) {
    width: 59%;
  }
`;

const WrapperFooterButtoms = styled.div`
  // Small devices (phones, 320 to 768... less than 768px)
  @media (min-width: 320px) {
    width: 100%;
    float: none;
  }

  @media (min-width: 1280px) {
    width: 59%;
    float: right;
  }
`;

const styles = {
  wrapper: {
    marginBottom: '50px',
  },
  queryName: {
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
  extraIcons: {
    display: 'flex',
    flexDirection: 'row',
    float: 'right',
    marginRight: '5px',
  },
  icons: {
    color: Palette.palette.primaryDark,
    cursor: 'pointer',
  },
  iconsBG: {
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
    boxSizing: 'border-box',
    fontSize: '14px',
    paddingBottom: '10px',
    paddingTop: '10px',
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
  filterContainer: {
    border: `1px solid ${Palette.palette.primaryDark}`,
    borderRadius: '4px',
    float: 'left',
    position: 'relative',
    backgroundColor: '#FFF',
    marginBottom: '15px',
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
  filterContent: {
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
  tableContainer: {
    float: 'right',
    marginTop: '-20px',
  },
  parameterValuesContainer: {

  },
  criteriaBuilderContainer: {

  },
  filterTab: { 
    backgroundColor: Palette.palette.primaryLight, 
    color: '#FFF', 
    position: 'relative', 
  },
  activeTab: { 
    backgroundColor: Palette.palette.primaryDark, 
    color: '#FFF', 
    position: 'relative', 
  },
};


@inject('queryListStore')
@inject('snackBarStore')
@inject('categoryStore')
@inject('sourceService')
@inject('queryService')
@observer
class QueryForm extends Component {
  constructor(props) {
    super(props);
    this.parameterMapperStore = new ParameterMapperStore();
    this.groupByField = null;
    this.queryFormStore = new QueryFormStore(this.props.sourceService, this.props.queryService, this.props.snackBarStore);
    this.criteriaBuilderStore = new CriteriaBuilderStore();
    this.parameterValuesStore = new ParameterValuesStore();
    this.groupByBuilderStore = new GroupByBuilderStore();
    this.selectFilterStore = new SelectFilterStore();
    this.footerStore = new FooterStore();
    this.validationStore = new ValidationStore();
    this.state = {
      tab1Style: styles.activeTab,
      tab2Style: styles.filterTab,
      tab3Style: styles.filterTab, 
    };

    this.fieldsValidationProps = {
      nameValidationProps: {
        required: true,
        parentId: undefined,
        fieldId: Utils.getNewId(),
        name: 'fldName',
        customErrorText: ''
      },
      descriptionValidationProps: {
        required: true,
        parentId: undefined,
        fieldId: Utils.getNewId(),
        name: 'fldDescription',
        customErrorText: ''
      },
      entryValidationProps: {
        required: true,
        parentId: undefined,
        fieldId: Utils.getNewId(),
        name: 'fldEntry',
        customErrorText: ''
      },
      categoryValidationProps: {
        required: true,
        parentId: undefined,
        fieldId: Utils.getNewId(),
        name: 'fldCategory',
        customErrorText: ''
      }
    };

    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.nameValidationProps);
    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.descriptionValidationProps);
    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.entryValidationProps);
    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.categoryValidationProps);
  }

  componentDidMount = () => {
    this.queryFormStore.fetchSources();
    this.props.categoryStore.fetch();
    Object.values(this.fieldsValidationProps).forEach((validationProp) => {
      ValidationEngine.validateRules(this.validationStore, '', validationProp.parentId, validationProp.fieldId, validationProp.name);
    });
  }

  onExpandedChange = (newExpanded) => {
    if (this.groupByBuilderStore.allowExpandGroup) {
      this.queryFormStore.setExpandedRows(newExpanded);
    }
  }

  handleNameChange = (props, e) => {
    const value = e.target.value;
    if (ValidationEngine.validateRules(this.validationStore, value, props.parentId, props.fieldId, props.name)) {
      this.queryFormStore.name = value;
    }
  }

  handleDescriptionChange = (props, e) => {
    const value = e.target.value;
    if (ValidationEngine.validateRules(this.validationStore, value, props.parentId, props.fieldId, props.name)) {
      this.queryFormStore.description = value;
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const groupBy = Object.assign({}, { groupby: this.groupByBuilderStore.groupBy, allowExpand: this.groupByBuilderStore.allowExpandGroup, aggregation: this.groupByBuilderStore.aggregations });
    const selectFilter = this.selectFilterStore.selects.filter((field) => {
      return field.include === true;
    });

    this.props.queryListStore.add({
      name: this.queryFormStore.name,
      description: this.queryFormStore.description,
      entry: this.queryFormStore.entry,
      category: this.queryFormStore.category,
      isSingleQuery: this.queryFormStore.isSingleQuery,
      idDataSource: this.queryFormStore.source.id,
      parameters: this.parameterValuesStore.getDataForSave(),
      criteriaFilter: this.criteriaBuilderStore.rules.length > 0 ? this.criteriaBuilderStore.rules : [],
      group: groupBy,
      summary: this.footerStore.aggregations.length > 0 ? this.footerStore.aggregations : [],
      selects: selectFilter,
      linkedQueryId: this.queryFormStore.selectedLinkedQuery.id,
      linkedQueryParametersMap: this.parameterMapperStore.getMappedParameters()
    });

    this.props.router.push('/queries/index');
  }

  handleActiveTab = (tab) => {
    const label = tab.props.label;
    if (label === 'Filtros') {
      this.setState({
        tab1Style: styles.activeTab,
        tab2Style: styles.filterTab,
        tab3Style: styles.filterTab,
      });
    } else if (label === 'Campos de Consulta') {
      this.setState({
        tab2Style: styles.activeTab,
        tab1Style: styles.filterTab,
        tab3Style: styles.filterTab,
      });
    } else if (label === 'Vincular Consulta') {
      this.setState({
        tab3Style: styles.activeTab,
        tab2Style: styles.filterTab,
        tab1Style: styles.filterTab,
      });
      this.toggleModal();
    }
  }

  handleChangeQueryType = (event, value) => {
    this.queryFormStore.isSingleQuery = value;
  }

  handleChangeEntry = (props, entry) => {
    this.queryFormStore.entry = entry;
    ValidationEngine.validateRules(this.validationStore, entry.name, props.parentId, props.fieldId, props.name);
  }

  handleChangeCategory = (props, category) => {
    this.queryFormStore.category = category;
    ValidationEngine.validateRules(this.validationStore, category.name, props.parentId, props.fieldId, props.name);
  }

  handleChangeAutocomplete = (value, index) => {
    const sourceX = this.queryFormStore.findSourceByIndex(index);
    this.selectFilterStore.fromSchema(sourceX.schema);
    this.parameterValuesStore.fillParameters(sourceX.parameters);
    this.queryFormStore.source = sourceX;
    this.queryFormStore.parameters = sourceX.parameters;
  }
/*
  handleEntryChangeAutocomplete = (props, index) => {
    const entry = this.props.categoryStore.entries[index];
    if (entry) {
      if (ValidationEngine.validateRules(this.validationStore, entry.name, props.parentId, props.fieldId, props.name)) {
        this.queryFormStore.entry = entry;
        this.props.categoryStore.filterCategoriesByEntryName(entry.name);
      }
    }
  }

  handleCategoryChangeAutocomplete = (props, index) => {
    const category = this.props.categoryStore.categories[index];
    if (category) {
      if (ValidationEngine.validateRules(this.validationStore, category.name, props.parentId, props.fieldId, props.name)) {
        this.queryFormStore.category = category;
      }
    }
  }
*/
  test = () => {
    const selectFilter = this.selectFilterStore.selects.filter((field) => {
      return field.include === true;
    });
    this.queryFormStore.testQuery({
      command: this.queryFormStore.source.command,
      parameters: this.parameterValuesStore.getDataForTest(),
      filters: this.criteriaBuilderStore.rules.length > 0 ? this.criteriaBuilderStore.rules : [],
      selects: selectFilter,
      catalog: this.queryFormStore.source.catalog
    });
  }

  isValid = () => {
    let result = false;
    if (!this.queryFormStore.isSingleQuery) {
      result = this.validationStore.errors.length === 0
      && this.queryFormStore.source
      && this.queryFormStore.schema.length > 0
      && ((this.queryFormStore.results.length === 1 && this.queryFormStore.isSingleQuery) || !this.queryFormStore.isSingleQuery);
    } else {
      result = this.validationStore.errors.length === 0;
    }
    return result;
  }

  toggleModal = () => {
    if (!this.queryFormStore.queriesFetched) {
      this.queryFormStore.fetchQueries();
    } else {
      this.queryFormStore.toggleModal(!this.queryFormStore.isModalOpen);
    }
  }

  toggleModalAndUpdateLinkedQueryParameterMap = () => {
    this.queryFormStore.toggleModal(false);
    const mappedParams = this.parameterMapperStore.getMappedParameters();
    this.queryFormStore.updateLinkedQueryParametersMap(mappedParams);
  }

  toggleModalGroupings = () => {
    this.queryFormStore.toggleModalGroupings(!this.queryFormStore.isModalGroupingsOpen);
  }

  toggleModalSummarization = () => {
    this.queryFormStore.toggleModalSummarization(!this.queryFormStore.isModalSummarizationOpen);
  }

  updateGrid = () => {

  }

  handleChangeLinkedQuery = (value) => {
    const linkedQuery = this.queryFormStore.queries.filter((x) => { return x.id === value; });
    this.queryFormStore.setLinkedQuery(linkedQuery);
  }

  dialogActions = [
    <FlatButton
      label="Cerrar"
      primary
      onClick={() => { this.toggleModalAndUpdateLinkedQueryParameterMap(); }}
    />
  ];

  groupingsDialogActions = [
    <FlatButton
      label="CANCELAR"
      primary
      onClick={() => { this.toggleModalGroupings(); }}
    />
  ];

  summarizationDialogActions = [
    <FlatButton
      label="CANCELAR"
      primary
      onClick={() => { this.toggleModalSummarization(); }}
    />
  ];

  criteriaBuilderHandler = () => {
    this.criteriaBuilderStore.addRule({ id: Utils.getNewId(), field: null, type: null, operator: 'equal', value: null });
  }

  render() {
    const schema = this.queryFormStore.source ? this.queryFormStore.source.schema : [];

    const sources = this.queryFormStore.sources.map((source) => {
      return source.name;
    });

    const results = this.queryFormStore.results.map((r) => { return Object.assign({}, r); });

    const columnsFilters = this.selectFilterStore.selects.filter((field) => {
      return field.include === true;
    });

    const columns = defineColumns(columnsFilters, results, this.groupByBuilderStore.groupBy, this.groupByBuilderStore.aggregations, this.footerStore.aggregations, this.groupByBuilderStore.allowExpandGroup);
    const pivot = this.groupByBuilderStore.groupBy.slice();

    const queryNameFieldId = Utils.getNewId();
    const queryDescriptionFieldId = Utils.getNewId();

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
      const entryFieldErrors = this.validationStore.getFieldErrors(this.fieldsValidationProps.entryValidationProps.fieldId);
      if (entryFieldErrors && entryFieldErrors.errors.length > 0) {
        this.fieldsValidationProps.entryValidationProps.customErrorText = ' ';
      } else {
        this.fieldsValidationProps.entryValidationProps.customErrorText = undefined;
      }
      const categoryFieldErrors = this.validationStore.getFieldErrors(this.fieldsValidationProps.categoryValidationProps.fieldId);
      if (categoryFieldErrors && categoryFieldErrors.errors.length > 0) {
        this.fieldsValidationProps.categoryValidationProps.customErrorText = ' ';
      } else {
        this.fieldsValidationProps.categoryValidationProps.customErrorText = undefined;
      }
    } else {
      this.fieldsValidationProps.nameValidationProps.customErrorText = undefined;
      this.fieldsValidationProps.descriptionValidationProps.customErrorText = undefined;
      this.fieldsValidationProps.entryValidationProps.customErrorText = undefined;
      this.fieldsValidationProps.categoryValidationProps.customErrorText = undefined;
    }
    return (
      <div style={styles.wrapper}>
        <div style={styles.windowTitle}>
          AGREGAR CONSULTA
        </div>
        <form onSubmit={this.handleSubmit}>
          <Paper style={styles.infoCard}>
            <div>
              <div style={styles.cardTitle}>
                NOMBRE DE LA CONSULTA
              </div>
              <div style={{ ...styles.iconAndTitle, width: '99%' }}>
                <div>
                  <QueryIcon style={{ ...styles.icons, paddingTop: '5px', width: 35, height: 35 }} />
                </div>
                <div style={{ marginLeft: '20px', width: '100%' }}>
                  <TextField
                    id={queryNameFieldId}
                    fullWidth
                    hintText="Escriba el nombre"
                    hintStyle={{ ...styles.queryName }}
                    underlineStyle={{ borderBottom: '1px solid #FC9900' }}
                    inputStyle={{ ...styles.queryName }}
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
                    value={this.queryFormStore.entry}
                    fullWidth
                    underlineStyle={{ borderBottom: '1px solid #FC9900' }}
                    iconStyle={{ fill: '#FC9900' }}
                    onChange={(event, index, value) => { return this.handleChangeEntry(this.fieldsValidationProps.entryValidationProps, value); }}
                    labelStyle={{ color: '#FC9900' }}
                  >
                    {this.props.categoryStore.entries.map((entry) => {
                      return <MenuItem key={entry.id} value={entry} primaryText={entry.name} />;
                    })}
                  </SelectField>
                </div>
              </div>

              <div style={styles.infoCardDetailTextBoxContainer}>
                <div>
                  <SelectField
                    floatingLabelText="CATEGORÍA"
                    floatingLabelStyle={{ color: '#AAAAAA', fontSize: '20px' }}
                    hintText="Seleccione"
                    hintStyle={{ color: '#FC9900', fontSize: '20px' }}
                    floatingLabelFixed
                    fullWidth
                    underlineStyle={{ borderBottom: '1px solid #FC9900' }}
                    iconStyle={{ fill: '#FC9900' }}
                    value={this.queryFormStore.category}
                    onChange={(event, index, value) => { return this.handleChangeCategory(this.fieldsValidationProps.categoryValidationProps, value); }}
                    labelStyle={{ color: '#FC9900' }}
                  >
                    {this.props.categoryStore.categories.map((cat) => {
                      return <MenuItem key={cat.id} value={cat} primaryText={cat.name} />;
                    })}
                  </SelectField>
                </div>
              </div>

              <div style={styles.infoCardDetailTextBoxContainer}>
                <div>
                  <AutoComplete
                    floatingLabelText="FUENTE DE DATOS"
                    floatingLabelStyle={{ color: '#AAAAAA', fontSize: '20px' }}
                    id={Utils.getNewId()}
                    hintText="Indique"
                    hintStyle={{ color: '#FC9900', fontSize: '20px' }}
                    underlineStyle={{ borderBottom: '1px solid #FC9900' }}
                    floatingLabelFixed
                    errorText={this.queryFormStore.source ? undefined : ' '}
                    fullWidth
                    filter={AutoComplete.caseInsensitiveFilter}
                    openOnFocus
                    onNewRequest={this.handleChangeAutocomplete}
                    dataSource={sources}
                  />
                </div>
              </div>

            </div> {/* cierre de <div style={styles.infoCardDetail}> */}

            <div style={{ ...styles.infoCardDetail }}>
              <div style={{ ...styles.infoCardDetailTextBoxContainer, width: '70%' }}>
                <div>
                  <TextField
                    id={queryDescriptionFieldId}
                    hintText="Descripción"
                    hintStyle={{ color: '#FC9900', fontSize: '20px' }}
                    floatingLabelStyle={{ color: '#AAAAAA', fontSize: '20px' }}
                    floatingLabelFixed
                    errorText={this.fieldsValidationProps.descriptionValidationProps.customErrorText}
                    fullWidth
                    inputStyle={{ color: '#FC9900' }}
                    underlineStyle={{ borderBottom: '1px solid #FC9900' }}
                    floatingLabelText="DESCRIPCIÓN"
                    onChange={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                    onBlur={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                  />
                </div>
              </div>

              <div style={{ ...styles.infoCardDetailTextBoxContainer, width: '30%', boxSizing: 'border-box' }}>
                <div style={styles.infoCardDetailTextBoxTitle}>
                  TIPO DE CONSULTA
                </div>
                <div>
                  <RadioButtonGroup
                    name="shipSpeed"
                    defaultSelected={false}
                    onChange={this.handleChangeQueryType}
                    style={{ display: 'flex' }}
                  >
                    <RadioButton
                      value={false}
                      label="Lista"
                      iconStyle={{ fill: '#FC9900' }}
                      labelStyle={{ color: '#FC9900' }}
                      style={{ width: '45%' }}
                    />
                    <RadioButton
                      value
                      label="Detalle"
                      iconStyle={{ fill: '#FC9900' }}
                      labelStyle={{ color: '#FC9900' }}
                      style={{ width: '45%' }}
                    />
                  </RadioButtonGroup>
                </div>
              </div>

            </div>

          </Paper>

          <div style={{ ...styles.backBottom, float: 'left' }}>
            <FlatButton label="« VOLVER A CONSULTAS" onClick={() => { this.props.router.push('/queries/index'); }} />
          </div>

          {this.queryFormStore.source &&
          <div style={{ float: 'right', marginBottom: '15px', marginTop: '15px' }}>
            <RaisedButton
              label="ACTUALIZAR"
              icon={<AutorenewIcon />}
              backgroundColor="#F5683A"
              labelColor="#FFF"
              buttonStyle={{ width: '150px', borderRadius: 25 }}
              style={{ borderRadius: 25 }}
              onClick={this.test}
            />
          </div>}
          <div style={{ clear: 'both' }} />

          {/* Aquí empieza la sección de FILTROS Y TABLA Y BOTONES */}


          {this.queryFormStore.source &&
          <div>
            <div>

              <WrapperFilter style={styles.filterContainer}>
                <Tabs inkBarStyle={{ background: Palette.palette.primaryDark }}>
                  <Tab label="Filtros" style={this.state.tab1Style} onActive={this.handleActiveTab} data-route="/home">
                    <div style={{ padding: '10px' }}>
                      <WrapperFilterContent style={{ ...styles.filterContent }}>
                        <div style={styles.filterMainTitle}>
                          Filtros principales
                        </div>
                        <div style={styles.parameterValuesContainer}>
                          {this.queryFormStore.source &&
                            <ParameterValues editingMode validationStore={this.validationStore} store={this.parameterValuesStore} />
                          }
                        </div>
                        <div style={{ borderTop: '2px solid #315698', marginTop: '5px' }} />
                        <div style={styles.criteriaBuilderContainer}>
                          <CriteriaBuilder
                            rules={this.criteriaBuilderStore.rules}
                            schema={schema}
                            store={this.criteriaBuilderStore}
                            validationStore={this.validationStore}
                          />
                        </div>
                      </WrapperFilterContent>
                    </div>
                    <div style={styles.filterFooter}>
                      <div style={{ float: 'left', padding: '15px 15px 15px 20px', fontWeight: 'bold', fontSize: '15px', color: '#3E73DC', marginTop: '8px' }}>
                        Agrega filtros adicionales
                      </div>
                      <div style={{ float: 'right', padding: '15px 15px 15px 20px' }}>
                        <RaisedButton
                          label="AGREGAR"
                          primary
                          onClick={this.criteriaBuilderHandler}
                        />
                      </div>
                      <div style={{ clear: 'both' }} />
                    </div>
                  </Tab>
                  <Tab label="Campos de Consulta" style={this.state.tab2Style} onActive={this.handleActiveTab} data-route="/home">
                    <div style={{ padding: '10px' }}>
                      {this.queryFormStore.source &&
                        <SelectFilter store={this.selectFilterStore} updateCallback={this.updateGrid} />
                      }
                    </div>
                  </Tab>
                  {!this.queryFormStore.isSingleQuery &&
                  <Tab
                    label="Vincular Consulta"
                    style={this.state.tab3Style}
                    onActive={this.handleActiveTab}
                    data-route="/home"
                    //onActive={(e) => { this.toggleModalAndUpdateLinkedQueryParameterMap(e); }}
                    //onActive={(e) => { this.toggleModal(e); }}
                    //style={{ backgroundColor: Palette.palette.primaryLight, color: '#FFF' }}
                  >
                    <div />
                  </Tab>
                  }
                </Tabs>
              </WrapperFilter>

              <WrapperTable style={styles.tableContainer}>
                {this.queryFormStore.isSingleQuery === false ?
                  (<div className="horizontal-table">
                    <ReactTable
                      loading={this.queryFormStore.fetching}
                      data={results}
                      columns={columns}
                      pivotBy={pivot}
                      showPagination={false}
                      expanded={this.queryFormStore.expandedRows}
                      onExpandedChange={(newExpanded, index, event) => { this.onExpandedChange(newExpanded, index, event); }}
                      previousText="« Ant"
                      nextText="Sig »"
                      pageText="Pág."
                      style={{ minHeight: '500px' }}
                    />
                  </div>) : (<FormDetail data={results} schema={this.selectFilterStore.selects} />)
                }
              </WrapperTable>
              <div style={{ clear: 'both' }} />

            </div>

            <div>
              <WrapperFooterButtoms style={{ marginTop: '10px' }}>
                {!this.queryFormStore.isSingleQuery &&
                  <div style={{ float: 'left' }}>
                    <RaisedButton
                      label="AGREGAR AGRUPAMIENTOS"
                      primary
                      onClick={(e) => { this.toggleModalGroupings(e); }}
                      buttonStyle={{ backgroundColor: Palette.queryEdit.backgroundActionButton1, border: `1px solid ${Palette.queryEdit.borderActionButton1}` }}
                      labelStyle={{ color: Palette.queryEdit.textColorActionButton1 }}
                      style={{ marginRight: '10px' }}
                    />
                    <RaisedButton
                      label="AGREGAR SUMARIZACIÓN"
                      primary
                      onClick={(e) => { this.toggleModalSummarization(e); }}
                      buttonStyle={{ backgroundColor: Palette.queryEdit.backgroundActionButton1, border: `1px solid ${Palette.queryEdit.borderActionButton1}` }}
                      labelStyle={{ color: Palette.queryEdit.textColorActionButton1 }}
                    />
                  </div>
                } 
                <div style={{ float: 'right' }}>
                  <RaisedButton
                    label="GUARDAR CONSULTA"
                    primary
                    type="submit"
                    disabled={!this.isValid()}
                    onClick={(e) => { this.handleSubmit(e); }}
                    buttonStyle={{ backgroundColor: Palette.queryEdit.backgroundActionButton2, border: `1px solid ${Palette.queryEdit.borderActionButton2}` }}
                    labelStyle={{ color: Palette.queryEdit.textColorActionButton2 }}
                  />
                </div>
                <div style={{ clear: 'both' }} />
              </WrapperFooterButtoms>
              <div style={{ clear: 'both' }} />

            </div>
          </div>
          }

          {/* Aquí termina la sección de FILTROS Y TABLA Y BOTONES */}

          {/* MODAL VINCULAR CONSULTA */}
          {this.queryFormStore.isModalOpen && <Dialog
            title="Vincular Consulta"
            actions={this.dialogActions}
            modal
            open={this.queryFormStore.isModalOpen}
            onRequestClose={this.toggleModal}
          >
            <SelectField
              floatingLabelText="Consulta hija"
              hintText="Seleccione consulta hija"
              underlineShow={false}
              value={this.queryFormStore.selectedLinkedQuery.id}
              onChange={(event, index, value) => { return this.handleChangeLinkedQuery(value); }}
            >
              {this.queryFormStore.queries.map((query) => {
                return <MenuItem key={query.id} value={query.id} primaryText={query.name} />;
              })}
            </SelectField>
            <br />
            <ParameterMapper
              mappedParameters={this.queryFormStore.linkedQueryParametersMap}
              parameters={this.queryFormStore.selectedLinkedQuery.parameters}
              options={this.queryFormStore.source.schema}
              store={this.parameterMapperStore}
            />
          </Dialog>
          }
          {/* CIERRE MODAL VINCULAR CONSULTA */}

          {/* MODAL AGRUPAMIENTOS */}
          {this.queryFormStore.source && <Dialog
            title="Agrupamientos"
            actions={this.groupingsDialogActions}
            modal
            open={this.queryFormStore.isModalGroupingsOpen}
            onRequestClose={this.toggleModalGroupings}
            autoScrollBodyContent
          >
            <GroupByBuilder
              groupBy={this.groupByBuilderStore.groupBy}
              aggregations={this.groupByBuilderStore.aggregations}
              schema={schema}
              store={this.groupByBuilderStore}
              validationStore={this.validationStore}
            />
          </Dialog>}
          {/* CIERRE MODAL AGRUPAMIENTOS */}

          {/* MODAL SUMARIZACIONES */}
          {this.queryFormStore.source && <Dialog
            title="Sumarizaciones"
            actions={this.summarizationDialogActions}
            modal
            open={this.queryFormStore.isModalSummarizationOpen}
            onRequestClose={this.toggleModalSummarization}
            autoScrollBodyContent
          >
            <FooterBuilder
              aggregations={this.footerStore.aggregations}
              schema={schema}
              store={this.footerStore}
              validationStore={this.validationStore}
            />
          </Dialog>}
          {/* CIERRE MODAL SUMARIZACIONES */}

        </form>

      </div>
    );
  }
}

export default QueryForm;
