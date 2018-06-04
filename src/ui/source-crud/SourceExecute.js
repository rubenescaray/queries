import React, { Component } from 'react';
import 'whatwg-fetch';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SourceIcon from 'material-ui/svg-icons/action/dns';
import FavoriteBorderIcon from 'material-ui/svg-icons/action/favorite-border';
import AutorenewIcon from 'material-ui/svg-icons/action/autorenew';
//import SelectField from 'material-ui/SelectField';
//import MenuItem from 'material-ui/MenuItem';
//import DeleteIcon from 'material-ui/svg-icons/action/delete';
//import Checkbox from 'material-ui/Checkbox';
import styled from 'styled-components';
//import LinkIcon from 'material-ui/svg-icons/editor/insert-link';
import ReactTable from 'react-table';
import { Tabs, Tab } from 'material-ui/Tabs';
import { inject, observer } from 'mobx-react';
//import { sourceService } from '../../services/Services';
//import { Row, Column } from '../../components/layout/gridSystem';
import ParameterValues from '../../components/parameter-values/ParameterValues';
import ParameterValuesStore from '../../components/parameter-values/stores/ParameterValuesStore';
import SourceExecuteStore from './stores/SourceExecuteStore';
import ValidationStore from '../../components/validation/validationStore';
//import DateInput from '../../components/inputs/Date';
import './SourceExecute.css';
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
/*
const WrapperFilterContent = styled.div`
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
    marginBottom: '50px',
  },
};

@inject('loaderStore')
@inject('snackBarStore')
@inject('sourceService')
@observer
class SourceExecute extends Component {
  constructor(props) {
    super(props);
    this.sourceExecuteStore = new SourceExecuteStore(this.props.sourceService, this.props.snackBarStore, this.props.loaderStore);
    this.validationStore = new ValidationStore();
    this.parameterValuesStore = new ParameterValuesStore();
  }
  componentDidMount() {
    this.sourceExecuteStore.getSourceWithPromise(this.props.params.id).then((source) => {
      this.parameterValuesStore.fillParameters(source.parameters);
    });
  }
  addValueToParameter = (fieldName, value) => {
    const parameter = this.queryExecuteStore.query.parameters.find((x) => { return x.name === fieldName; });
    parameter.value = value;
  }
  test = () => {
    this.sourceExecuteStore.testSource({
      command: this.sourceExecuteStore.source.command,
      parameters: this.parameterValuesStore.getDataForTest(),
      catalog: this.sourceExecuteStore.source.catalog
    });
  }
  render() {
    const gridColumns = this.sourceExecuteStore.schema.map((s) => {
      return {
        Header: s.name,
        accessor: s.name,
        minWidth: 150,
        maxWidth: undefined
      };
    });
    return (
      <div>
        <div style={styles.windowTitle}>
          VER ORIGEN DE DATOS
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Paper style={styles.infoCard}>
            <div>
              <div style={styles.iconAndTitle}>
                <div>
                  <SourceIcon style={{ ...styles.icons, paddingTop: '2px' }} />
                </div>
                <div style={{ marginLeft: '20px' }}>
                  <label style={styles.sourceName}>{this.sourceExecuteStore.source !== null ? this.sourceExecuteStore.source.name : ''}</label>
                </div>
              </div>
              <div style={styles.extraIcons}>
                <div>
                  <FavoriteBorderIcon style={{ ...styles.iconsBG }} />
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
                    disabled
                    underlineDisabledStyle={{ borderBottom: '1px solid #7EAAE3' }}
                    value={(this.sourceExecuteStore.source !== null) ? this.sourceExecuteStore.source.description : ''}
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
                    disabled
                    underlineDisabledStyle={{ borderBottom: '1px solid #7EAAE3' }}
                    value={(this.sourceExecuteStore.source !== null) ? this.sourceExecuteStore.source.command : ''}
                    inputStyle={{ ...styles.infoCardTextBox }}
                  />
                </div>
              </div>
              <div style={styles.infoCardDetailTextBoxContainer}>
                <div style={styles.infoCardDetailTextBoxTitle}>
                  NOMBRE DEL CATALOGO
                </div>
                <div>
                  <TextField
                    fullWidth
                    disabled
                    underlineDisabledStyle={{ borderBottom: '1px solid #7EAAE3' }}
                    value={(this.sourceExecuteStore.source !== null) ? this.sourceExecuteStore.source.catalog : ''}
                    inputStyle={{ ...styles.infoCardTextBox }}
                  />
                </div>
              </div>
            </div>
          </Paper>
        </div>
        <WrapperFilter style={styles.filterContainer}>
          <Tabs inkBarStyle={{ background: Palette.palette.primaryDark, overflow: 'auto' }}>
            <Tab label="Filtros" style={{ backgroundColor: Palette.palette.primaryLight, color: '#FFF', overflow: 'auto' }}>
              <ParameterValues 
                validationStore={this.validationStore}
                store={this.parameterValuesStore}
              />
            </Tab>
          </Tabs>
        </WrapperFilter>
        {/*<WrapperFilter style={styles.filterContainer}>
          <Tabs inkBarStyle={{ background: Palette.palette.primaryDark }}>
            <Tab label="Filtros" style={{ backgroundColor: Palette.palette.primaryLight, color: '#FFF' }}>
              <WrapperFilterContent style={{ ...styles.filterContent, justifyContent: 'space-evenly' }}>
                <div style={{ width: '40.66%', display: 'flex', flex: '1 0 auto', marginRight: '20px' }}>
                  <TextField
                    hintText="Agregar"
                    hintStyle={{ color: '#FC9900', fontSize: '18px' }}
                    floatingLabelStyle={{ color: '#AAAAAA', fontSize: '16px' }}
                    floatingLabelFixed
                    fullWidth
                    inputStyle={{ color: '#FC9900', display: 'block' }}
                    underlineStyle={{ borderBottom: '1px solid #FC9900' }}
                    floatingLabelText="Sucursal"
                  />
                </div>
                <div style={{ width: '16.66%', display: 'flex', flex: '1 0 auto', marginRight: '20px' }}>
                  <DateInput
                    hintText="Seleccionar"
                    floatingLabelStyle={{ color: '#AAA', whiteSpace: 'nowrap' }}
                    inputStyle={{ fontSize: '12px' }}
                    underlineStyle={{ width: '150%', borderColor: '#ff9933' }}
                    hintStyle={{ color: '#ff9933', fontSize: '16px', }}
                    floatingLabelFocusStyle={{ color: '#AAA', whiteSpace: 'nowrap' }}
                    underlineFocusStyle={{ borderColor: '#ff9933' }}
                    fullWidth
                    floatingLabelFixed
                    floatingLabelText={'Emision desde'}
                    key={'Chao'}//props.name
                    //{...props}
                    //validationStore={props.validationStore}
                    //handleChange={handleChange}
                  />
                </div>
                <div style={{ width: '16.66%', display: 'flex', flex: '1 0 auto', marginRight: '20px' }}>
                  <DateInput
                    hintText="Seleccionar"
                    floatingLabelStyle={{ color: '#AAA', whiteSpace: 'nowrap' }}
                    inputStyle={{ fontSize: '12px' }}
                    underlineStyle={{ width: '150%', borderColor: '#ff9933' }}
                    hintStyle={{ color: '#ff9933', fontSize: '16px', }}
                    floatingLabelFocusStyle={{ color: '#AAA', whiteSpace: 'nowrap' }}
                    underlineFocusStyle={{ borderColor: '#ff9933' }}
                    fullWidth
                    floatingLabelFixed
                    floatingLabelText={'Emision hasta'}
                    key={'Hola'}//props.name 
                    //{...props}
                    //validationStore={props.validationStore}
                    //handleChange={handleChange}
                  />
                </div>
              </WrapperFilterContent>
            </Tab>
          </Tabs>
        </WrapperFilter>*/}
        <div style={{ ...styles.backBottom, float: 'left' }}>
          <FlatButton label="« VOLVER A ORIGEN DE DATOS" onClick={() => { this.props.router.push('/sources/index'); }} />
        </div>

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
        </div>
        <WrapperTable style={styles.tableContainer}>
          <div className="horizontal-table">
            <ReactTable
              loading={this.sourceExecuteStore.fetching}
              data={this.sourceExecuteStore.results}
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
        {/*<Paper style={style}>
          <form onSubmit={this.handleSubmit}>
            <Row>
              <Column>
                <TextField
                  hintText="Nombre del Origen de Datos"
                  underlineDisabledStyle={{ display: 'none' }}
                  floatingLabelText="Nombre"
                  fullWidth
                  value={(this.sourceExecuteStore.source !== null) ? this.sourceExecuteStore.source.name : ''}
                  disabled
                />
              </Column>
              <Column>
                <TextField
                  hintText="Descripción del Origen"
                  underlineDisabledStyle={{ display: 'none' }}
                  floatingLabelText="Descripción"
                  fullWidth
                  value={(this.sourceExecuteStore.source !== null) ? this.sourceExecuteStore.source.description : ''}
                  disabled
                />
              </Column>
              <Column>
                <TextField
                  hintText="Comando SQL a Ejecutar"
                  underlineDisabledStyle={{ display: 'none' }}
                  floatingLabelText="Nombre de Comando"
                  fullWidth
                  value={(this.sourceExecuteStore.source !== null) ? this.sourceExecuteStore.source.command : ''}
                  disabled
                />
              </Column>
              <Column>
                <TextField
                  hintText="Catalogo"
                  underlineDisabledStyle={{ display: 'none' }}
                  floatingLabelText="Nombre del Catalogo"
                  fullWidth
                  value={(this.sourceExecuteStore.source !== null) ? this.sourceExecuteStore.source.catalog : ''}
                  disabled
                />
              </Column>
            </Row>
            <br />
            <h4>Parametros</h4>
            <ParameterValues validationStore={this.validationStore} store={this.parameterValuesStore} />
            <br />
            <RaisedButton
              label="Vista Previa"
              primary
              onClick={this.test}
            />
            <br />
            <h4>Vista Previa:</h4>
            <div className="horizontal-table">
              {gridColumns.length > 0 && <ReactTable
                loading={this.sourceExecuteStore.fetching}
                data={this.sourceExecuteStore.results}
                columns={gridColumns}
                showPagination={false}
              />}
            </div>
            <br />
            <FlatButton label="Cancelar" onClick={() => { this.props.router.push('/sources/index'); }} />
          </form>
        </Paper>*/}
      </div>
    );
  }
}

export default SourceExecute;
