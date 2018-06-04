/* eslint no-param-reassign: ["error", { "props": false }]*/
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { inject, observer } from 'mobx-react';
import ReactTable from 'react-table';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import SocialShare from 'material-ui/svg-icons/social/share';
import DownloadIcon from 'material-ui/svg-icons/content/archive';
//import FontIcon from 'material-ui/FontIcon';
import { Link } from 'react-router';
import CopyToClipboard from 'react-copy-to-clipboard';
import Settings from '../../settings';
import { defineColumns } from '../../components/table/columnsDefiner';
import ParameterValues from '../../components/parameter-values/ParameterValues';
import ParameterValuesStore from '../../components/parameter-values/stores/ParameterValuesStore';
import CriteriaBuilder from '../../components/criteria-builder/CriteriaBuilder';
import CriteriaBuilderStore from '../../components/criteria-builder/stores/CriteriaBuilderStore';
import ValidationStore from '../../components/validation/validationStore';
import QueryExecuteStore from './stores/QueryExecuteStore';
import { queryService } from '../../services/Services';
import FormDetail from '../../components/form-detail/FormDetail';
import { Row, Column } from '../../components/layout/gridSystem';

const style = {
  width: '100%',
  padding: '20px',
};

const nameTextStyle = {
  marginRight: '10px'
};

const shareButtonStyle = {
  margin: 0,
  top: 100,
  right: 20,
  position: 'fixed',
  zIndex: 1000,
};

const dialogStyle = {
  overflowX: 'hidden'
};


/*const shareIconStyle = {
  margin: 0,
  top: 90,
  right: 20,
  position: 'fixed',
  zIndex: 1000,
};*/

const convertToBase64 = (object) => {
  const objJsonStr = JSON.stringify(object);
  return new Buffer(objJsonStr).toString('base64');
};

const ExecuteQueryComponent = (props) => {
  const tod = {};
  tod.pathname = `queries/execute/${props.linkedQueryId}/false`;
  const paramsValues = props.getLinkedQueryParamsValues(props.row.original);
  tod.query = { params: convertToBase64(paramsValues) };
  return <Link to={tod} target="_blank" ><FlatButton label="Detalle" primary /></Link>;
};

@inject('categoryStore')
@inject('snackBarStore')
@inject('loaderStore')
@observer
class QueryExecute extends Component {
  constructor(props) {
    super(props);
    this.queryExecuteStore = new QueryExecuteStore(queryService, this.props.snackBarStore, this.props.categoryStore, this.props.loaderStore);
    this.criteriaBuilderStore = new CriteriaBuilderStore();
    this.parameterValuesStore = new ParameterValuesStore();
    this.validationStore = new ValidationStore();
  }
  componentDidMount() {
    this.props.categoryStore.fetch();
    //console.log('query: ', this.props.location.query);
    //console.log('params: ', this.props.location.query.params);
    if (this.props.location.query && this.props.location.query.params) {
      //console.log('entro al if');
      this.queryExecuteStore.getQuery(this.props.params.id)
      .then(() => {
        this.parameterValuesStore.fillParameters(this.queryExecuteStore.source.parameters, this.getLinkedQueryParamValues(this.props.location.query.params));
        this.execute();
      });
    } else if (this.props.params.hasrequiredparams === 'true') {
      this.queryExecuteStore.getQuery(this.props.params.id)
      .then(() => {
        this.parameterValuesStore.fillParameters(this.queryExecuteStore.source.parameters, this.queryExecuteStore.query.parameters);
      });
    } else {
      this.queryExecuteStore.executeQueryById(this.props.params.id)
      .then(() => {
        this.parameterValuesStore.fillParameters(this.queryExecuteStore.source.parameters, this.queryExecuteStore.parameters);
      });
    }
  }

  onExpandedChange = (newExpanded) => {
    /*Object.keys(newExpanded).forEach((key) => {
      //.queryExecuteStore.allowExpand
      if (newExpanded[key] !== false && this.queryExecuteStore.allowExpand) {
        newExpanded[key] = {};
      }
    });*/
    if (this.queryExecuteStore.allowExpand) {
      this.queryExecuteStore.setExpandedRows(newExpanded);
    }
  }
  getParameters = () => {
    let parameterValues = this.parameterValuesStore.getDataForTest();
    parameterValues = parameterValues.map((pv) => {
      const sourceParam = this.queryExecuteStore.source.parameters.find((sp) => {
        return sp.name === pv.name;
      });
      if (sourceParam && sourceParam.allowNull && pv.value === '') {
        pv.value = null;
      }
      return pv;
    });
    return parameterValues;
  }
  getLinkedQueryParamValues = (encodedParams) => {
    const objJsonB64 = Buffer.from(encodedParams, 'base64');
    return JSON.parse(objJsonB64.toString());
  }
  mapLinkedQueryParamsValues = (rowData) => {
    const detailQueryParamsValues = [];
    this.queryExecuteStore.linkedQueryParametersMap.forEach((paramMap) => {
      const detailQueryParamValue = {};
      detailQueryParamValue.name = paramMap.childParamName;
      detailQueryParamValue.value = rowData[paramMap.fieldName];
      detailQueryParamsValues.push(detailQueryParamValue);
    });
    return detailQueryParamsValues;
  }
  handleOpen = () => {
    this.queryExecuteStore.setShowShareDialog(true);
  }
  handleClose = () => {
    this.queryExecuteStore.setShowShareDialog(false);
  };
  handleCopy = () => {

  }

  exportToFile = () => {
    this.queryExecuteStore.exportToCSV();
  }

  execute = () => {
    const executeParams = {
      queryId: this.queryExecuteStore.queryId,
      parameters: this.getParameters(),
      filters: this.criteriaBuilderStore.rules,
    };
    this.queryExecuteStore.executeQuery(executeParams);
  }
  addValueToParameter = (fieldName, value) => {
    const parameter = this.queryExecuteStore.query.parameters.find((x) => { return x.name === fieldName; });
    parameter.value = value;
  }

  render() {
    const columns = defineColumns(this.queryExecuteStore.selects.length > 0 ? this.queryExecuteStore.selects : this.queryExecuteStore.schema, this.queryExecuteStore.results, this.queryExecuteStore.group.groupBy, this.queryExecuteStore.group.aggregation, this.queryExecuteStore.summary, this.queryExecuteStore.allowExpand);
    if (this.queryExecuteStore.linkedQueryId) {
      const linkedQueryComponentProps = { linkedQueryId: this.queryExecuteStore.linkedQueryId, getLinkedQueryParamsValues: this.mapLinkedQueryParamsValues };
      const linkedQueryColumn = {};
      linkedQueryColumn.Cell = (row) => {
        linkedQueryComponentProps.row = row;
        return (
          <ExecuteQueryComponent {...linkedQueryComponentProps} />
        );
      };
      columns.unshift(linkedQueryColumn);
    }
    //const url = this.props.location;
    const actions = [
      <FlatButton
        label="Cerrar"
        primary
        onTouchTap={this.handleClose}
      />,
    ];
    return (
      <div>
        {(this.queryExecuteStore.query || this.queryExecuteStore.schema) &&
        <div>
          <h2>Ejecutar Consulta</h2>
          <Paper style={style}>
            <Row>
              <Column>
                <TextField
                  hintText="Nombre de la Consulta"
                  floatingLabelText="Nombre"
                  underlineDisabledStyle={{ display: 'none' }}
                  fullWidth
                  value={this.queryExecuteStore.queryName}
                  disabled
                  style={nameTextStyle}
                />
                <Dialog
                  title="Compartir consulta"
                  actions={actions}
                  modal
                  open={this.queryExecuteStore.showShareDialog}
                  bodyStyle={dialogStyle}
                >

                  <TextField
                    value={`${Settings.webApiBaseUri}/query/share/${this.props.params.id}`}
                    disabled
                    fullWidth
                    underlineDisabledStyle={{ display: 'none' }}
                    name={'copyUrlText'}
                    style={nameTextStyle}
                  />
                  <CopyToClipboard
                    text={`${Settings.webApiBaseUri}/query/share/${this.props.params.id}`}
                    onCopy={() => { return this.queryExecuteStore.setUrlCopied(true); }}
                  >
                    <RaisedButton label={!this.queryExecuteStore.urlCopied ? 'Copia URL' : 'Copiada'} /*disabled={this.queryExecuteStore.urlCopied}*/ />
                  </CopyToClipboard>
                </Dialog>
              </Column>
              <Column>
                <TextField
                  floatingLabelText="Rubro"
                  underlineDisabledStyle={{ display: 'none' }}
                  value={this.queryExecuteStore.entry.name}
                  fullWidth
                  disabled
                />
              </Column>
              <Column>
                <TextField
                  floatingLabelText="Categoría"
                  underlineDisabledStyle={{ display: 'none' }}
                  value={this.queryExecuteStore.category.name}
                  fullWidth
                  disabled
                />
              </Column>
              <Column>
                <TextField
                  hintText="Descripción de la Consulta"
                  floatingLabelText="Descripción"
                  underlineDisabledStyle={{ display: 'none' }}
                  value={this.queryExecuteStore.queryDescription}
                  fullWidth
                  disabled
                />
              </Column>
            </Row>
            <div>
              <h4>Parametros</h4>
              <ParameterValues validationStore={this.validationStore} store={this.parameterValuesStore} />
            </div>
            <div>
              <h4>Filtros</h4>
              <CriteriaBuilder
                rules={this.criteriaBuilderStore.rules}
                schema={this.queryExecuteStore.schema}
                store={this.criteriaBuilderStore}
                validationStore={this.validationStore}
              />
            </div>
            <br />
            <RaisedButton
              label="Ejecutar"
              primary
              onClick={this.execute}
            />
            <br />
            <br />
            {this.props.params.hasrequiredparams !== 'true' && <FloatingActionButton style={shareButtonStyle} mini default onClick={this.handleOpen}>
              <SocialShare />
            </FloatingActionButton>}
            <FloatingActionButton style={shareButtonStyle} mini default onClick={this.exportToFile}>
              <DownloadIcon />
            </FloatingActionButton>
            {this.queryExecuteStore.isSingleQuery === false ?
            (<div className="horizontal-table">
              {columns && columns.length > 0 && this.queryExecuteStore.selects.length &&
                <ReactTable
                  getTrGroupProps={this.setTdProps}
                  loading={this.queryExecuteStore.fetching}
                  className="-stripped -highlight"
                  defaultPageSize={10}
                  showPagination
                  data={this.queryExecuteStore.results}
                  columns={columns}
                  pivotBy={this.queryExecuteStore.group.groupBy}
                  expanded={this.queryExecuteStore.expandedRows}
                  onExpandedChange={(newExpanded, index, event) => { this.onExpandedChange(newExpanded, index, event); }}
                />
              }
            </div>) : (<FormDetail data={this.queryExecuteStore.results.length > 0 ? this.queryExecuteStore.results : []} schema={this.queryExecuteStore.selects} />)
            }
            <br />
            <FlatButton label="Cancelar" onClick={() => { this.props.router.push('/queries/index'); }} />
          </Paper>
        </div>
      }
      </div>
    );
  }
}

export default QueryExecute;
