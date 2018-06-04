/* eslint no-param-reassign: ["error", { "props": false }]*/
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import { Tabs, Tab } from 'material-ui/Tabs';
import ReactTable from 'react-table';
import styled from 'styled-components';
import 'react-table/react-table.css';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import QueryIcon from 'material-ui/svg-icons/action/chrome-reader-mode';
import ModeEditIcon from 'material-ui/svg-icons/editor/mode-edit';
import FavoriteBorderIcon from 'material-ui/svg-icons/action/favorite-border';
import LinkIcon from 'material-ui/svg-icons/editor/insert-link';
import AutorenewIcon from 'material-ui/svg-icons/action/autorenew';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Utils from '../../utils';
import { defineColumns } from '../../components/table/columnsDefiner';
//import { sourceService, queryService } from '../../services/Services';
import CriteriaBuilder from '../../components/criteria-builder/CriteriaBuilder';
import CriteriaBuilderStore from '../../components/criteria-builder/stores/CriteriaBuilderStore';
import ValidationStore from '../../components/validation/validationStore';
import GroupByBuilder from '../../components/aggregation-builder/GroupByBuilder';
import FooterBuilder from '../../components/aggregation-builder/FooterBuilder';
import FooterStore from '../../components/aggregation-builder/stores/FooterStore';
import GroupByBuilderStore from '../../components/aggregation-builder/stores/GroupByBuilderStore';
import ValidationSummary from '../../components/validation/ValidationSummary';
import ParameterValues from '../../components/parameter-values/ParameterValues';
import ParameterValuesStore from '../../components/parameter-values/stores/ParameterValuesStore';
import ParameterMapper from '../../components/parameter-mapper/ParameterMapper';
import ParameterMapperStore from '../../components/parameter-mapper/stores/ParameterMapperStore';
import SelectFilter from '../../components/select-filter/SelectFilter';
import SelectFilterStore from '../../components/select-filter/stores/SelectFilterStore';
import FormDetail from '../../components/form-detail/FormDetail';
import * as ValidationEngine from '../../components/validation/validationEngine';
import QueryEditStore from './stores/QueryEditStore';
//import { Row, Column } from '../../components/layout/gridSystem';
import Palette from '../../Palette';
import TextFieldIcon from '../../components/inputs/TextFieldIcon';
//import Accordion from '../../components/accordion/Accordion';

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
    marginTop: '-15px',
  },
  queryName: {
    color: Palette.infoCard.titleTextColor,
    fontSize: '24px',
    fontWeight: 'bold',
  },
  iconAndTitle: {
    display: 'flex',
    flexDirection: 'row',
    float: 'left',
    marginLeft: '3px',
  },
  infoCard: {
    backgroundColor: Palette.infoCard.backgroundColor,
    padding: '18px 24px 18px',
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
    fontSize: '16px',
    paddingBottom: '16px',
    paddingTop: '3px'
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

@inject('loaderStore')
@inject('snackBarStore')
@inject('categoryStore')
@inject('sourceService')
@inject('queryService')
@observer
class QueryEdit extends Component {
  constructor(props) {
    super(props);
    this.groupByField = null;
    this.queryEditStore = new QueryEditStore(this.props.sourceService, this.props.queryService, this.props.categoryStore, this.props.snackBarStore, this.props.loaderStore);
    this.criteriaBuilderStore = new CriteriaBuilderStore();
    this.parameterMapperStore = new ParameterMapperStore();
    this.groupByBuilderStore = new GroupByBuilderStore();
    this.parameterValuesStore = new ParameterValuesStore();
    this.selectFilterStore = new SelectFilterStore();
    this.footerStore = new FooterStore();
    this.validationStore = new ValidationStore();
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
      } };
    this.state = {
      tab1Style: styles.activeTab,
      tab2Style: styles.filterTab,
      tab3Style: styles.filterTab, 
    };

    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.nameValidationProps);
    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.descriptionValidationProps);
    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.entryValidationProps);
    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.categoryValidationProps);
  }

  componentDidMount() {
    this.props.categoryStore.fetch();
    this.queryEditStore.getQuery(this.props.params.id).then(() => {
      if (this.queryEditStore.query.group) {
        this.groupByBuilderStore.setGroupBy(this.queryEditStore.query.group.groupBy);
        this.groupByBuilderStore.setAllowExpandGroup(this.queryEditStore.query.group.allowExpand !== undefined ? this.queryEditStore.query.group.allowExpand : true);
      }
      this.selectFilterStore.mixSchemaWithSelects(this.queryEditStore.query.source.schema, this.queryEditStore.query.selects);
      this.queryEditStore.query.group.aggregation.forEach((aggregation) => { this.groupByBuilderStore.addAggregation(aggregation); });
      this.queryEditStore.query.summary.forEach((aggregation) => { this.footerStore.addAggregation(aggregation); });
      this.criteriaBuilderStore.rules = this.queryEditStore.query.criteriaFilter.map((criteria) => { return Object.assign(criteria, { id: Utils.getNewId() }); });
      this.parameterValuesStore.fillParameters(this.queryEditStore.query.source.parameters, this.queryEditStore.query.parameters);
      this.queryEditStore.fetchQueries(this.queryEditStore.query.linkedQueryId).then(() => {
        this.parameterMapperStore.loadProperties(this.queryEditStore.linkedQueryParametersMap, this.queryEditStore.selectedLinkedQuery.parameters);
      });
      this.test();
    }).catch((error) => {
      this.props.snackBarStore.setMessage(error);
    });
  }

  onExpandedChange = (newExpanded) => {
    if (this.groupByBuilderStore.allowExpandGroup) {
      this.queryEditStore.setExpandedRows(newExpanded);
    }
  }

  handleNameChange = (props, e) => {
    this.queryEditStore.name = e.target.value;
    ValidationEngine.validateRules(this.validationStore, e.target.value, props.parentId, props.fieldId, props.name);
  }

  handleDescriptionChange = (props, e) => {
    this.queryEditStore.description = e.target.value;
    ValidationEngine.validateRules(this.validationStore, e.target.value, props.parentId, props.fieldId, props.name);
  }

  handleChangeEntry = (props, entry) => {
    this.queryEditStore.entry = entry;
    ValidationEngine.validateRules(this.validationStore, entry.name, props.parentId, props.fieldId, props.name);
  }

  handleChangeCategory = (props, category) => {
    this.queryEditStore.category = category;
    ValidationEngine.validateRules(this.validationStore, category.name, props.parentId, props.fieldId, props.name);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const selectFilter = this.selectFilterStore.selects.map((s) => {
      const column = {
        label: s.label,
        name: s.name,
        type: s.type,
        include: s.include
      };
      return column;
    })
    .filter((field) => {
      return field.include === true;
    });

    const groupBy = Object.assign({}, { groupby: this.groupByBuilderStore.groupBy, allowExpand: this.groupByBuilderStore.allowExpandGroup, aggregation: this.groupByBuilderStore.aggregations });

    this.queryEditStore.updateQuery({
      id: this.queryEditStore.query.id,
      name: this.queryEditStore.name,
      description: this.queryEditStore.description,
      entry: this.queryEditStore.entry,
      category: this.queryEditStore.category,
      isSingleQuery: this.queryEditStore.isSingleQuery,
      idDataSource: this.queryEditStore.source.id,
      parameters: this.parameterValuesStore.getDataForSave(),
      criteriaFilter: this.criteriaBuilderStore.rules.length > 0 ? this.criteriaBuilderStore.rules : [],
      group: groupBy,
      summary: this.footerStore.aggregations.length > 0 ? this.footerStore.aggregations : [],
      selects: selectFilter,
      linkedQueryId: this.queryEditStore.selectedLinkedQuery ? this.queryEditStore.selectedLinkedQuery.id : null,
      linkedQueryParametersMap: this.parameterMapperStore.getMappedParameters()
    })
      .then(() => {
        this.props.router.push('/queries/index');
      })
      .catch((error) => {
        this.props.snackBarStore.setMessage(error);
      });
  }

  handleChangeQueryType = (event, value) => {
    this.queryEditStore.isSingleQuery = value;
  }

  test = () => {
    const selectFilter = this.queryEditStore.query.source.schema.map((s) => {
      const column = {
        label: s.name,
        name: s.name,
      };
      return column;
    });
    this.queryEditStore.testQuery({
      command: this.queryEditStore.source.command,
      parameters: this.parameterValuesStore.getDataForTest(),
      filters: this.criteriaBuilderStore.rules,
      selects: selectFilter,
      catalog: this.queryEditStore.source.catalog
    });
  }

  isValid = () => {
    let result = false;
    if (!this.queryEditStore.isSingleQuery) {
      result = this.validationStore.errors.length === 0
      && ((this.queryEditStore.results.length === 1 && this.queryEditStore.isSingleQuery) || !this.queryEditStore.isSingleQuery);
    } else {
      result = this.validationStore.errors.length === 0;
    }
    return result;
  }

  updateGrid= () => {

  }

  toggleModalAndUpdateLinkedQueryParameterMap = () => {
    this.queryEditStore.toggleModal(!this.queryEditStore.isModalOpen);
    const mappedParams = this.parameterMapperStore.getMappedParameters();
    this.queryEditStore.updateLinkedQueryParametersMap(mappedParams);
  }

  toggleModalGroupings = () => {
    this.queryEditStore.toggleModalGroupings(!this.queryEditStore.isModalGroupingsOpen);
  }

  toggleModalSummarization = () => {
    this.queryEditStore.toggleModalSummarization(!this.queryEditStore.isModalSummarizationOpen);
  }

  handleChangeLinkedQuery = (value) => {
    const linkedQuery = this.queryEditStore.queries.filter((x) => { return x.id === value; });
    this.queryEditStore.setLinkedQuery(linkedQuery);
  }

  dialogActions = [
    <FlatButton
      label="CERRAR"
      primary
      onClick={() => { this.toggleModalAndUpdateLinkedQueryParameterMap(); }}
    />
  ];

  groupingsDialogActions = [
    <FlatButton
      label="CERRAR"
      primary
      onClick={() => { this.toggleModalGroupings(); }}
    />
  ];

  summarizationDialogActions = [
    <FlatButton
      label="CERRAR"
      primary
      onClick={() => { this.toggleModalSummarization(); }}
    />
  ];

  criteriaBuilderHandler = () => {
    this.criteriaBuilderStore.addRule({ id: Utils.getNewId(), field: null, type: null, operator: 'equal', value: null });
  }

  handleLinkQuery = () => {
    console.log('aaa');
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
    }
  }

  render() {
    let source = {};
    let schema = [];
    let results = [];

    if (this.queryEditStore.query) {
      source = this.queryEditStore.query.source;
      schema = (source.schema) ? source.schema : [];
    }

    results = this.queryEditStore.results;

    const columnsFilters = this.selectFilterStore.selects.filter((field) => {
      return field.include === true;
    });

    // schema ? schema
    const columns = defineColumns(columnsFilters, results, this.groupByBuilderStore.groupBy, this.groupByBuilderStore.aggregations, this.footerStore.aggregations, this.groupByBuilderStore.allowExpandGroup);

    let pivot;
    if (this.groupByBuilderStore.groupBy) {
      pivot = this.groupByBuilderStore.groupBy.toJS();
    }
    if (columns.length === 0) {
      pivot = [];
    }

    //console.log(pivot);
    const queryNameFieldId = Utils.getNewId();
    const queryDescriptionFieldId = Utils.getNewId();
    const sourceNameTextFieldId = Utils.getNewId();

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
      <div style={{ marginBottom: '70px' }}>
        <ValidationSummary errors={this.validationStore.errors} />
        <form onSubmit={this.handleSubmit}>
          <div style={styles.windowTitle}>
            EDITAR CONSULTA
          </div>
          <Paper style={styles.infoCard}>
            <div>
              <div style={styles.iconAndTitle}>
                <div>
                  <QueryIcon style={{ ...styles.icons, paddingTop: '2px', width: 30, height: 30 }} />
                </div>
                <div style={{ marginLeft: '20px', width: '400px' }}>
                  <TextFieldIcon
                    id={queryNameFieldId}
                    fullWidth
                    underlineStyle={{ borderBottom: '1px solid #7EAAE3' }}
                    icon={<ModeEditIcon />}
                    iconProps={{ iconStyle: { color: '#7EAAE3' } }}
                    value={this.queryEditStore.name}
                    onChange={(e) => { this.handleNameChange(this.fieldsValidationProps.nameValidationProps, e); }}
                    onBlur={(e) => { this.handleNameChange(this.fieldsValidationProps.nameValidationProps, e); }}
                    inputStyle={{ ...styles.infoCardTextBox, ...styles.queryName, marginTop: '-10px' }}
                  />
                </div>
              </div>
              <div style={styles.extraIcons}>
                <div>
                  <FavoriteBorderIcon style={{ ...styles.iconsBG }} />
                </div>
                <div style={{ marginLeft: '8px' }}>
                  <LinkIcon style={{ ...styles.iconsBG }} />
                </div>
              </div>
              <div style={{ clear: 'both' }} />
            </div>

            <div style={styles.infoCardDetail}>
              <div style={styles.infoCardDetailTextBoxContainer}>
                <div style={styles.infoCardDetailTextBoxTitle}>
                  ÁREA
                </div>
                <div>
                  <SelectField
                    fullWidth
                    value={this.queryEditStore.entry}
                    onChange={(event, index, value) => { return this.handleChangeEntry(this.fieldsValidationProps.entryValidationProps, value); }}
                    labelStyle={{ color: '#FFF' }}
                  >
                    {this.props.categoryStore.entries.map((entry) => {
                      return <MenuItem key={entry.id} value={entry} primaryText={entry.name} />;
                    })}
                  </SelectField>
                </div>
              </div>

              <div style={styles.infoCardDetailTextBoxContainer}>
                <div style={styles.infoCardDetailTextBoxTitle}>
                  CATEGORÍA
                </div>
                <div>
                  <SelectField
                    fullWidth
                    value={this.queryEditStore.category}
                    onChange={(event, index, value) => { return this.handleChangeCategory(this.fieldsValidationProps.entryValidationProps, value); }}
                    labelStyle={{ color: '#FFF' }}
                  >
                    {this.props.categoryStore.categories.map((cat) => {
                      return <MenuItem key={cat.id} value={cat} primaryText={cat.name} />;
                    })}
                  </SelectField>
                </div>
              </div>

              <div style={styles.infoCardDetailTextBoxContainer}>
                <div style={styles.infoCardDetailTextBoxTitle}>
                  FUENTE DE DATOS
                </div>
                <div>
                  <TextField
                    id={sourceNameTextFieldId}
                    fullWidth
                    disabled
                    underlineDisabledStyle={{ borderBottom: '1px solid #7EAAE3' }}
                    value={source.name ? source.name : ''}
                    onChange={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                    onBlur={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                    inputStyle={{ ...styles.infoCardTextBox, color: '#6685B7' }}
                  />
                </div>
              </div>

            </div> {/* cierre de <div style={styles.infoCardDetail}> */}

            <div style={{ ...styles.infoCardDetail, width: '96%' }}>
              <div style={{ ...styles.infoCardDetailTextBoxContainer, width: '70%' }}>
                <div style={styles.infoCardDetailTextBoxTitle}>
                  DESCRIPCIÓN
                </div>
                <div>
                  <TextFieldIcon
                    id={queryDescriptionFieldId}
                    fullWidth
                    underlineStyle={{ borderBottom: '1px solid #7EAAE3' }}
                    icon={<ModeEditIcon />}
                    iconProps={{ iconStyle: { color: '#7EAAE3' } }}
                    value={this.queryEditStore.description}
                    onChange={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                    onBlur={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                    inputStyle={{ ...styles.infoCardTextBox }}
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
                    valueSelected={this.queryEditStore.isSingleQuery}
                    onChange={this.handleChangeQueryType}
                    style={{ display: 'flex' }}
                  >
                    <RadioButton
                      value={false}
                      //checked={!this.queryEditStore.isSingleQuery}
                      label="Lista"
                      iconStyle={{ fill: '#9BCDFE' }}
                      labelStyle={{ color: '#9BCDFE' }}
                      style={{ width: '45%' }}
                    />
                    <RadioButton
                      value
                      //checked={this.queryEditStore.isSingleQuery}
                      label="Detalle"
                      iconStyle={{ fill: '#9BCDFE' }}
                      labelStyle={{ color: '#9BCDFE' }}
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

          <div style={{ float: 'right', marginBottom: '15px', marginTop: '15px' }}>
            <RaisedButton
              label="ACTUALIZAR"
              icon={<AutorenewIcon />}
              backgroundColor="#F5683A"
              labelColor="#FFF"
              buttonStyle={{ width: '150px', borderRadius: 25 }}
              style={{ borderRadius: 25 }}
              onClick={() => { this.test(); }}
            />
          </div>
          <div style={{ clear: 'both' }} />

          <div> {/* Aquí empieza la sección de FILTROS Y TABLA */}

            <WrapperFilter style={styles.filterContainer}>
              <Tabs inkBarStyle={{ background: Palette.palette.primaryDark }}>
                <Tab label="Filtros" style={this.state.tab1Style} onActive={this.handleActiveTab} data-route="/home">
                  <div style={{ padding: '0px 10px 10px 10px' }}>
                    <WrapperFilterContent style={{ ...styles.filterContent }}>
                      <div style={styles.parameterValuesContainer}>
                        <ParameterValues editingMode validationStore={this.validationStore} store={this.parameterValuesStore} />
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
                <Tab label="Campos de Consulta" style={this.state.tab2Style} data-route="/home" onActive={this.handleActiveTab}>
                  <div style={{ padding: '10px' }}>
                    <SelectFilter store={this.selectFilterStore} updateCallback={this.updateGrid} />
                  </div>
                </Tab>
                <Tab
                  label="Vincular Consulta"
                  onActive={this.handleActiveTab}
                  data-route="/home"
                  //onActive={(e) => { this.toggleModalAndUpdateLinkedQueryParameterMap(e); }}
                  style={this.state.tab3Style}
                >
                  <div style={{ margin: '5px 15px 10px 20px', }} >
                    <div>
                      <div>
                        <SelectField
                          floatingLabelText="Consulta hija que se vinculara"
                          hintText="Seleccione consulta hija"
                          underlineShow
                          value={this.queryEditStore.selectedLinkedQuery.id}
                          style={{ width: '70%', fontSize: '13px' }}
                          floatingLabelStyle={{ color: 'rgb(170, 170, 170)' }}
                          onChange={(event, index, value) => { return this.handleChangeLinkedQuery(value); }}
                        >
                          {this.queryEditStore.queries.map((query) => {
                            return <MenuItem key={query.id} value={query.id} primaryText={query.name} />;
                          })}
                        </SelectField>
                      </div>
                      <div style={{ borderTop: '2px solid #315698', marginTop: '5px' }} />
                      <div style={{ overflowY: 'auto' }}>
                        {this.parameterMapperStore.parameters &&
                          <ParameterMapper
                            parameters={this.queryEditStore.selectedLinkedQuery.parameters}
                            mappedParameters={this.queryEditStore.linkedQueryParametersMap}
                            options={this.queryEditStore.source.schema}
                            store={this.parameterMapperStore}
                          />
                        }
                      </div>
                    </div>
                    <div style={{ bottom: '0', width: '100%', zIndex: '1000', }}>
                      <div style={{ float: 'right', padding: '15px 15px 15px 20px' }}>
                        <RaisedButton
                          label={'Cancelar'}
                          backgroundColor={'rgb(170, 170, 170)'}
                          labelStyle={{ color: 'white' }}
                          style={{ marginRight: '15px' }}
                        />
                        <RaisedButton
                          label="VINCULAR"
                          primary
                        />
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </WrapperFilter>

            <WrapperTable style={styles.tableContainer}>
              {this.queryEditStore.isSingleQuery === false ?
                (<div className="horizontal-table">
                  <ReactTable
                    loading={this.queryEditStore.fetching}
                    data={results}
                    columns={columns}
                    pivotBy={pivot}
                    showPagination={false}
                    expanded={this.queryEditStore.expandedRows}
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

          </div> {/* Aquí termina la sección de FILTROS Y TABLA */}

          {/* Aquí empieza el footer buttons */}
          <WrapperFooterButtoms style={{ marginTop: '10px' }}>
            {!this.queryEditStore.isSingleQuery &&
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
                buttonStyle={{ backgroundColor: Palette.queryEdit.backgroundActionButton2, border: `1px solid ${Palette.queryEdit.borderActionButton2}` }}
                labelStyle={{ color: Palette.queryEdit.textColorActionButton2 }}
              />
            </div>
            <div style={{ clear: 'both' }} />
          </WrapperFooterButtoms>
          <div style={{ clear: 'both' }} />
          {/* Aquí termina el footer buttons */}

          {/* MODAL VINCULAR CONSULTA */}
          {/*this.queryEditStore.isModalOpen && this.queryEditStore.linkedQueryParametersMap && <Dialog
            title="Admite Detalle"
            actions={this.dialogActions}
            modal
            open={this.queryEditStore.isModalOpen}
            onRequestClose={this.toggleModalAndUpdateLinkedQueryParameterMap}
          >
            <SelectField
              floatingLabelText="Consulta hija"
              hintText="Seleccione consulta hija"
              underlineShow={false}
              value={this.queryEditStore.selectedLinkedQuery.id}
              onChange={(event, index, value) => { return this.handleChangeLinkedQuery(value); }}
            >
              {this.queryEditStore.queries.map((query) => {
                return <MenuItem key={query.id} value={query.id} primaryText={query.name} />;
              })}
            </SelectField>
            <br />
            {this.queryEditStore.selectedLinkedQuery &&
              <ParameterMapper
                parameters={this.queryEditStore.selectedLinkedQuery.parameters}
                mappedParameters={this.queryEditStore.linkedQueryParametersMap}
                options={this.queryEditStore.source.schema}
                store={this.parameterMapperStore}
              />
            }
          </Dialog>*/}
          {/* CIERRE MODAL VINCULAR CONSULTA */}

          {/* MODAL AGRUPAMIENTOS */}
          {this.queryEditStore.isModalGroupingsOpen && this.queryEditStore.linkedQueryParametersMap && source && source !== null && <Dialog
            title="Agrupamientos"
            actions={this.groupingsDialogActions}
            modal
            open={this.queryEditStore.isModalGroupingsOpen}
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
          {this.queryEditStore.isModalSummarizationOpen && this.queryEditStore.linkedQueryParametersMap && source && source !== null && <Dialog
            title="Sumarizaciones"
            actions={this.summarizationDialogActions}
            modal
            open={this.queryEditStore.isModalSummarizationOpen}
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

        {/*<ValidationSummary errors={this.validationStore.errors} />
        <Paper style={style}>
          <form onSubmit={this.handleSubmit}>
            {this.queryEditStore.query &&
            <div>
              <div>
                <h4>Parametros</h4>
                <ParameterValues editingMode validationStore={this.validationStore} store={this.parameterValuesStore} />
              </div>
              <div>
                <h4>Filtros</h4>
                <CriteriaBuilder
                  rules={this.criteriaBuilderStore.rules}
                  schema={schema}
                  store={this.criteriaBuilderStore}
                  validationStore={this.validationStore}
                />
              </div>
              <br />
              <h4>Campos</h4>
              <SelectFilter store={this.selectFilterStore} updateCallback={this.updateGrid} />
              <br />
              <h4>Tipo de Consulta</h4>
              <div>
                <RadioButtonGroup name="queryType" defaultSelected={this.queryEditStore.isSingleQuery} onChange={this.handleChangeQueryType}>
                  <RadioButton
                    value={false}
                    label="Lista"
                    style={{ marginBottom: 5 }}
                  />
                  <RadioButton
                    value
                    label="Detalle"
                    style={{ marginBottom: 16 }}
                  />
                </RadioButtonGroup>
              </div>
            </div>
            }
            {source && source !== null &&
              <div>
                {!this.queryEditStore.isSingleQuery &&
                  <FlatButton
                    label="Vincular Consulta"
                    onClick={(e) => { this.toggleModalAndUpdateLinkedQueryParameterMap(e); }}
                    style={{ marginBottom: 5 }}
                  />
                }
                <br />
                <br />
                <RaisedButton
                  label="Vista Previa"
                  primary
                  onClick={this.test}
                />
                <h4>Vista Previa:</h4>
                {this.queryEditStore.isSingleQuery === false ?
                  (<div className="horizontal-table">
                    <ReactTable
                      loading={this.queryEditStore.fetching}
                      data={results}
                      columns={columns}
                      pivotBy={pivot}
                      showPagination={false}
                      expanded={this.queryEditStore.expandedRows}
                      onExpandedChange={(newExpanded, index, event) => { this.onExpandedChange(newExpanded, index, event); }}
                    />
                  </div>) : (<FormDetail data={results} schema={this.selectFilterStore.selects} />)
                }
                <div style={operations}>
                  <h3>Operaciones de Usuario</h3>
                  <div>
                    <h4>Agrupamientos</h4>
                    <GroupByBuilder
                      groupBy={this.groupByBuilderStore.groupBy}
                      aggregations={this.groupByBuilderStore.aggregations}
                      schema={schema}
                      store={this.groupByBuilderStore}
                      validationStore={this.validationStore}
                    />
                  </div>
                  <br />
                  <div>
                    <h4>Sumarizaciones</h4>
                    <FooterBuilder
                      aggregations={this.footerStore.aggregations}
                      schema={schema}
                      store={this.footerStore}
                      validationStore={this.validationStore}
                    />
                  </div>
                </div>
              </div>
            }
            {this.queryEditStore.isModalOpen && this.queryEditStore.linkedQueryParametersMap && <Dialog
              title="Admite Detalle"
              actions={this.dialogActions}
              modal
              open={this.queryEditStore.isModalOpen}
              onRequestClose={this.toggleModalAndUpdateLinkedQueryParameterMap}
            >
              <SelectField
                floatingLabelText="Consulta hija"
                hintText="Seleccione consulta hija"
                underlineShow={false}
                value={this.queryEditStore.selectedLinkedQuery.id}
                onChange={(event, index, value) => { return this.handleChangeLinkedQuery(value); }}
              >
                {this.queryEditStore.queries.map((query) => {
                  return <MenuItem key={query.id} value={query.id} primaryText={query.name} />;
                })}
              </SelectField>
              <br />
              {this.queryEditStore.selectedLinkedQuery &&
                <ParameterMapper
                  parameters={this.queryEditStore.selectedLinkedQuery.parameters}
                  mappedParameters={this.queryEditStore.linkedQueryParametersMap}
                  options={this.queryEditStore.source.schema}
                  store={this.parameterMapperStore}
                />
              }
            </Dialog>
            }
            <br />
            <FlatButton label="Cancelar" onClick={() => { this.props.router.push('/queries/index'); }} />
            <RaisedButton
              label="Guardar"
              primary
              type="submit"
              disabled={!this.isValid()}
            />
          </form>
        </Paper>*/}
      </div>
    );
  }
}

export default QueryEdit;
