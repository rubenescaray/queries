import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { inject, observer } from 'mobx-react';
import ReactTable from 'react-table';
import styled from 'styled-components';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
//import FloatingActionButton from 'material-ui/FloatingActionButton';
//import SocialShare from 'material-ui/svg-icons/social/share';
//import DownloadIcon from 'material-ui/svg-icons/content/archive';
import QueryIcon from 'material-ui/svg-icons/action/chrome-reader-mode';
import FavoriteBorderIcon from 'material-ui/svg-icons/action/favorite-border';
import LinkIcon from 'material-ui/svg-icons/editor/insert-link';
import AutorenewIcon from 'material-ui/svg-icons/action/autorenew';
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
//import { queryService } from '../../services/Services';
import FormDetail from '../../components/form-detail/FormDetail';
//import { Row, Column } from '../../components/layout/gridSystem';
import Palette from '../../Palette';
import Utils from '../../utils';
import '../../styles/react-table-query.css';

/*const style = {
  width: '100%',
  padding: '20px',
};*/

/*const nameTextStyle = {
  marginRight: '10px'
};*/

/*const shareButtonStyle = {
  margin: 0,
  top: 100,
  right: 20,
  position: 'fixed',
  zIndex: 1000,
};*/

/*const dialogStyle = {
  overflowX: 'hidden'
};*/

const WrapperFilter = styled.div`
  // Small devices (phones, 320 to 768... less than 768px)
  @media (min-width: 320px) {
    width: 100%;
  }

  // Medium devices (tablets, 768 to 1024... less than 1024px)
  @media only screen
    and (min-width: 768px) {
      //width: 39%;
      width: 100%;
      min-height: 300px;
  }

  @media (min-width: 1280px) {
    //width: 100%;
    width: 39%;
    max-height: 500px;
  }
`;

/*const WrapperFilterContent = styled.div`
  // Small devices (phones, 320 to 768... less than 768px)
  @media (min-width: 320px) {
    //width: 100%;
  }

  // Medium devices (tablets, 768 to 1024... less than 1024px)
  @media only screen
    and (min-width: 768px) {
      //width: 100%;
  }

  @media (min-width: 1280px) {
    //width: 100%;
  }
`;*/

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
  }

  // Medium devices (tablets, 768 to 1024... less than 1024px)
  @media only screen
    and (min-width: 768px) {
      //width: 59%;
      width: 100%;
  }

  @media (min-width: 1280px) {
    //width: 100%;
    width: 59%;
  }
`;

const styles = {
  wrapper: {
    //marginTop: '-15px',
    marginBottom: '20px',
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
    zIndex: '2000',
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
    marginBottom: '15px',
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
@inject('queryService')
@observer
class QueryExecute extends Component {
  constructor(props) {
    super(props);
    this.queryExecuteStore = new QueryExecuteStore(this.props.queryService, this.props.snackBarStore, this.props.categoryStore, this.props.loaderStore);
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
      const pvAux = pv;
      const sourceParam = this.queryExecuteStore.source.parameters.find((sp) => {
        return sp.name === pvAux.name;
      });
      if (sourceParam && sourceParam.allowNull && pvAux.value === '') {
        pvAux.value = null;
      }
      return pvAux;
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

  criteriaBuilderHandler = () => {
    this.criteriaBuilderStore.addRule({ id: Utils.getNewId(), field: null, type: null, operator: 'equal', value: null });
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

    const actions = [
      <FlatButton
        label="Cerrar"
        primary
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <div style={styles.wrapper}>
        {(this.queryExecuteStore.query || this.queryExecuteStore.schema) &&
          <div>
            <div style={styles.windowTitle}>
              VER CONSULTA
            </div>
            <Paper style={styles.infoCard}>
              <div>
                <div style={styles.iconAndTitle}>
                  <div>
                    <QueryIcon style={{ ...styles.icons, paddingTop: '2px' }} />
                  </div>
                  <div style={{ marginLeft: '20px' }}>
                    <label style={styles.queryName}>{this.queryExecuteStore.queryName}</label>
                  </div>
                </div>
                <div style={styles.extraIcons}>
                  <div>
                    <FavoriteBorderIcon style={{ ...styles.iconsBG }} />
                  </div>
                  <div style={{ marginLeft: '8px' }}>
                    <LinkIcon style={{ ...styles.iconsBG }} onClick={this.handleOpen} />
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
                    <TextField
                      fullWidth
                      disabled
                      underlineDisabledStyle={{ borderBottom: '1px solid #7EAAE3' }}
                      value={this.queryExecuteStore.entry.name}
                      inputStyle={{ ...styles.infoCardTextBox }}
                    />
                  </div>
                </div>

                <div style={styles.infoCardDetailTextBoxContainer}>
                  <div style={styles.infoCardDetailTextBoxTitle}>
                    CATEGORÍA
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      disabled
                      underlineDisabledStyle={{ borderBottom: '1px solid #7EAAE3' }}
                      value={this.queryExecuteStore.category.name}
                      inputStyle={{ ...styles.infoCardTextBox }}
                    />
                  </div>
                </div>

                <div style={styles.infoCardDetailTextBoxContainer}>
                  <div style={styles.infoCardDetailTextBoxTitle}>
                    DESCRIPCIÓN
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      disabled
                      underlineDisabledStyle={{ borderBottom: '1px solid #7EAAE3' }}
                      value={this.queryExecuteStore.queryDescription}
                      inputStyle={{ ...styles.infoCardTextBox }}
                    />
                  </div>
                </div>
              </div>
            </Paper>

            <Dialog
              title="Compartir consulta"
              actions={actions}
              modal
              open={this.queryExecuteStore.showShareDialog}
              //bodyStyle={dialogStyle}
            >

              <TextField
                value={`${Settings.webApiBaseUri}/query/share/${this.props.params.id}`}
                disabled
                fullWidth
                underlineDisabledStyle={{ display: 'none' }}
                name={'copyUrlText'}
                //style={nameTextStyle}
              />
              <CopyToClipboard
                text={`${Settings.webApiBaseUri}/query/share/${this.props.params.id}`}
                onCopy={() => { return this.queryExecuteStore.setUrlCopied(true); }}
              >
                <RaisedButton label={!this.queryExecuteStore.urlCopied ? 'Copia URL' : 'Copiada'} /*disabled={this.queryExecuteStore.urlCopied}*/ />
              </CopyToClipboard>
            </Dialog>

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
                onClick={this.execute}
              />
            </div>
            <div style={{ clear: 'both' }} />

            <div> {/* Aquí empieza la sección de FILTROS Y TABLA */}

              <WrapperFilter style={styles.filterContainer}>
                <div style={styles.filterHeader}>
                  <div style={{ fontSize: '24px' }}>
                    Filtros
                  </div>
                  <div style={{ fontSize: '12px' }}>
                    Defina los parámetros de búsqueda para realizar la consulta
                  </div>
                </div>
                <WrapperFilterContent style={styles.filterContent}>
                  <div style={styles.filterMainTitle}>
                    Filtros principales
                  </div>
                  <div style={styles.parameterValuesContainer}>
                    <ParameterValues validationStore={this.validationStore} store={this.parameterValuesStore} sourceExecute />
                  </div>
                  <div style={{ borderTop: '2px solid #315698', marginTop: '5px' }} />
                  <div style={styles.criteriaBuilderContainer}>
                    <CriteriaBuilder
                      rules={this.criteriaBuilderStore.rules}
                      schema={this.queryExecuteStore.schema}
                      store={this.criteriaBuilderStore}
                      validationStore={this.validationStore}
                    />
                  </div>
                </WrapperFilterContent>
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
              </WrapperFilter>

              <WrapperTable style={styles.tableContainer}>
                {this.queryExecuteStore.isSingleQuery === false ?
                (<div>
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
                      previousText="« Ant"
                      nextText="Sig »"
                      pageText="Pág."
                      style={{ minHeight: '500px' }}
                    />
                  }
                </div>) : (<FormDetail data={this.queryExecuteStore.results.length > 0 ? this.queryExecuteStore.results : []} schema={this.queryExecuteStore.selects} />)
                }
              </WrapperTable>

            </div> {/* Aquí termina la sección de FILTROS Y TABLA */}
            <div style={{ clear: 'both' }} />

          </div>
        }
      </div>
    );
  }
}

export default QueryExecute;
