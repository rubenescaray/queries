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
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Utils from '../../utils';
import { defineColumns } from '../../components/table/columnsDefiner';
import { sourceService, queryService } from '../../services/Services';
import QueryFormStore from './stores/QueryFormStore';
import CriteriaBuilder from '../../components/criteria-builder/CriteriaBuilder';
import CriteriaBuilderStore from '../../components/criteria-builder/stores/CriteriaBuilderStore';
import ValidationStore from '../../components/validation/validationStore';
import GroupByBuilder from '../../components/aggregation-builder/GroupByBuilder';
import FooterBuilder from '../../components/aggregation-builder/FooterBuilder';
import FooterStore from '../../components/aggregation-builder/stores/FooterStore';
import GroupByBuilderStore from '../../components/aggregation-builder/stores/GroupByBuilderStore';
//import DynamicForm from '../../components/dynamic-form/DynamicForm';
import ParameterMapper from '../../components/parameter-mapper/ParameterMapper';
import ParameterMapperStore from '../../components/parameter-mapper/stores/ParameterMapperStore';
import ParameterValues from '../../components/parameter-values/ParameterValues';
import ParameterValuesStore from '../../components/parameter-values/stores/ParameterValuesStore';
import * as ValidationEngine from '../../components/validation/validationEngine';
import FormDetail from '../../components/form-detail/FormDetail';
import SelectFilter from '../../components/select-filter/SelectFilter';
import SelectFilterStore from '../../components/select-filter/stores/SelectFilterStore';
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


@inject('queryListStore')
@inject('snackBarStore')
@inject('categoryStore')
@observer
class QueryForm extends Component {
  constructor(props) {
    super(props);
    this.parameterMapperStore = new ParameterMapperStore();
    this.groupByField = null;
    this.queryFormStore = new QueryFormStore(sourceService, queryService, this.props.snackBarStore);
    this.criteriaBuilderStore = new CriteriaBuilderStore();
    this.parameterValuesStore = new ParameterValuesStore();
    this.groupByBuilderStore = new GroupByBuilderStore();
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
    //this.queryFormStore.fetchQueries();
    Object.values(this.fieldsValidationProps).forEach((validationProp) => {
      ValidationEngine.validateRules(this.validationStore, '', validationProp.parentId, validationProp.fieldId, validationProp.name);
    });
  }

  onExpandedChange = (newExpanded) => {
    /*Object.keys(newExpanded).forEach((key) => {
      if (newExpanded[key] !== false && this.groupByBuilderStore.allowExpandGroup) {
        newExpanded[key] = {};
      }
    });*/
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
      <div>
        <h2>Nueva Consulta</h2>
        <Paper style={style}>
          <form onSubmit={this.handleSubmit}>
            <Row>
              <Column>
                <TextField
                  id={queryNameFieldId}
                  hintText="Nombre de la consulta"
                  fullWidth
                  floatingLabelFixed
                  errorText={this.fieldsValidationProps.nameValidationProps.customErrorText}
                  floatingLabelText="Nombre"
                  onChange={(e) => { this.handleNameChange(this.fieldsValidationProps.nameValidationProps, e); }}
                  onBlur={(e) => { this.handleNameChange(this.fieldsValidationProps.nameValidationProps, e); }}
                />
              </Column>
              <Column>
                <SelectField
                  floatingLabelText="Rubro"
                  hintText="Seleccione el rubro"
                  floatingLabelFixed
                  underlineShow={false}
                  value={this.queryFormStore.entry}
                  fullWidth
                  onChange={(event, index, value) => { return this.handleChangeEntry(this.fieldsValidationProps.entryValidationProps, value); }}
                >
                  {this.props.categoryStore.entries.map((entry) => {
                    return <MenuItem key={entry.id} value={entry} primaryText={entry.name} />;
                  })}
                </SelectField>
                {/*
                <AutoComplete
                  id={Utils.getNewId()}
                  hintText="Rubro"
                  floatingLabelText="Rubro"
                  floatingLabelFixed
                  errorText={this.queryFormStore.entry ? undefined : ' '}
                  fullWidth
                  filter={AutoComplete.caseInsensitiveFilter}
                  openOnFocus
                  onNewRequest={(value, index) => { this.handleEntryChangeAutocomplete(this.fieldsValidationProps.entryValidationProps, index); }}
                  dataSource={this.props.categoryStore.entries.map((entry) => { return entry.name; }).slice()}
                />*/}
              </Column>
              <Column>
                <SelectField
                  floatingLabelText="Categoría"
                  hintText="Seleccione la categoría"
                  floatingLabelFixed
                  underlineShow={false}
                  fullWidth
                  value={this.queryFormStore.category}
                  onChange={(event, index, value) => { return this.handleChangeCategory(this.fieldsValidationProps.categoryValidationProps, value); }}
                >
                  {this.props.categoryStore.categories.map((cat) => {
                    return <MenuItem key={cat.id} value={cat} primaryText={cat.name} />;
                  })}
                </SelectField>
                {/*
                <AutoComplete
                  id={Utils.getNewId()}
                  hintText="Categoría"
                  floatingLabelText="Categoría"
                  floatingLabelFixed
                  errorText={this.queryFormStore.category ? undefined : ' '}
                  fullWidth
                  filter={AutoComplete.caseInsensitiveFilter}
                  openOnFocus
                  onNewRequest={(value, index) => { this.handleCategoryChangeAutocomplete(this.fieldsValidationProps.categoryValidationProps, index); }}
                  dataSource={this.props.categoryStore.categories.map((category) => { return category.name; }).slice()}
                />
                */}
              </Column>
            </Row>

            <Row>
              <Column>
                <TextField
                  id={queryDescriptionFieldId}
                  hintText="Descripción de la consulta"
                  floatingLabelFixed
                  errorText={this.fieldsValidationProps.descriptionValidationProps.customErrorText}
                  fullWidth
                  floatingLabelText="Descripción"
                  onChange={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                  onBlur={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                />
              </Column>
              <Column>
                <AutoComplete
                  id={Utils.getNewId()}
                  hintText="Origen de Datos"
                  floatingLabelFixed
                  floatingLabelText="Origen de Datos"
                  errorText={this.queryFormStore.source ? undefined : ' '}
                  fullWidth
                  filter={AutoComplete.caseInsensitiveFilter}
                  openOnFocus
                  onNewRequest={this.handleChangeAutocomplete}
                  dataSource={sources}
                />
              </Column>
            </Row>
            <br />
            {this.queryFormStore.source &&
              <div>
                <h4>Parametros</h4>
                <ParameterValues editingMode validationStore={this.validationStore} store={this.parameterValuesStore} />
              </div>
            }
            <br />
            {this.queryFormStore.source &&
              <div>
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
                  <RadioButtonGroup name="queryType" defaultSelected={false} onChange={this.handleChangeQueryType}>
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
                <br />
                {!this.queryFormStore.isSingleQuery &&
                  <FlatButton
                    label="Agregar Consulta Detallada"
                    onClick={(e) => { this.toggleModal(e); }}
                    style={{ marginBottom: 5 }}
                  />
                }
                <br />
                <br />
                <RaisedButton
                  label="Cargar Vista Previa"
                  primary
                  onClick={this.test}
                />
                <br />
                <h4>Vista Previa:</h4>
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
            {this.queryFormStore.isModalOpen && <Dialog
              title="Admite Detalle"
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

export default QueryForm;
