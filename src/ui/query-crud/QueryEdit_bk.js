/* eslint no-param-reassign: ["error", { "props": false }]*/
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
//import RefreshIndicator from 'material-ui/RefreshIndicator';
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
import { Row, Column } from '../../components/layout/gridSystem';

const style = {
  width: '100%',
  padding: '20px',
};

const operations = {
  marginTop: '20px',
  background: '#ffffff',
  padding: '10px',
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
    /*Object.keys(newExpanded).forEach((key) => {
      if (newExpanded[key] !== false && this.groupByBuilderStore.allowExpandGroup) {
        newExpanded[key] = {};
      }
    });*/
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
      linkedQueryParametersMap: this.queryEditStore.linkedQueryParametersMap ? this.queryEditStore.linkedQueryParametersMap : this.parameterMapperStore.getMappedParameters()
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
    /*this.queryEditStore.fetchQueries(this.props.params.id).then(() => {
      this.parameterMapperStore.loadProperties(this.queryEditStore.linkedQueryParametersMap, this.queryEditStore.selectedLinkedQuery.parameters);
    });*/
    this.queryEditStore.toggleModal(!this.queryEditStore.isModalOpen);
    const mappedParams = this.parameterMapperStore.getMappedParameters();
    this.queryEditStore.updateLinkedQueryParametersMap(mappedParams);
  }

  handleChangeLinkedQuery = (value) => {
    const linkedQuery = this.queryEditStore.queries.filter((x) => { return x.id === value; });
    this.queryEditStore.setLinkedQuery(linkedQuery);
  }

  dialogActions = [
    <FlatButton
      label="Cerrar"
      primary
      onClick={() => { this.toggleModalAndUpdateLinkedQueryParameterMap(); }}
    />
  ];

  render() {
    /*if (this.props.loaderStore.loading) {
      return (
        <div style={style.container}>
          <RefreshIndicator
            size={40}
            left={10}
            top={0}
            status="loading"
            style={style.refresh}
          />
        </div>
      );
    }*/
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
      <div>
        <ValidationSummary errors={this.validationStore.errors} />
        <h2>Editar Consulta</h2>
        <Paper style={style}>
          <form onSubmit={this.handleSubmit}>
            <Row>
              <Column>
                <TextField
                  id={queryNameFieldId}
                  hintText="Nombre de la Consulta"
                  fullWidth
                  floatingLabelText="Nombre"
                  value={this.queryEditStore.name}
                  onChange={(e) => { this.handleNameChange(this.fieldsValidationProps.nameValidationProps, e); }}
                  onBlur={(e) => { this.handleNameChange(this.fieldsValidationProps.nameValidationProps, e); }}
                />
              </Column>
              <Column>
                <SelectField
                  floatingLabelText="Rubro"
                  hintText="Seleccione el rubro"
                  underlineShow={false}
                  floatingLabelFixed
                  fullWidth
                  value={this.queryEditStore.entry}
                  onChange={(event, index, value) => { return this.handleChangeEntry(this.fieldsValidationProps.entryValidationProps, value); }}
                >
                  {this.props.categoryStore.entries.map((entry) => {
                    return <MenuItem key={entry.id} value={entry} primaryText={entry.name} />;
                  })}
                </SelectField>
              </Column>
              <Column>
                <SelectField
                  floatingLabelText="Categoría"
                  hintText="Seleccione la categoría"
                  floatingLabelFixed
                  underlineShow={false}
                  fullWidth
                  value={this.queryEditStore.category}
                  onChange={(event, index, value) => { return this.handleChangeCategory(this.fieldsValidationProps.entryValidationProps, value); }}
                >
                  {this.props.categoryStore.categories.map((cat) => {
                    return <MenuItem key={cat.id} value={cat} primaryText={cat.name} />;
                  })}
                </SelectField>
              </Column>
            </Row>
            <Row>
              <Column>
                <TextField
                  id={queryDescriptionFieldId}
                  hintText="Descripción de la Consulta"
                  fullWidth
                  floatingLabelText="Descripción"
                  value={this.queryEditStore.description}
                  onChange={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                  onBlur={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                />
              </Column>
              <Column>
                <TextField
                  id={sourceNameTextFieldId}
                  fullWidth
                  floatingLabelText="Fuente de datos"
                  value={source.name ? source.name : ''}
                  underlineDisabledStyle={{ display: 'none' }}
                  disabled
                />
              </Column>
            </Row>
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
        </Paper>
      </div>
    );
  }
}

export default QueryEdit;
