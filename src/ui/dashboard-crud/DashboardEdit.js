import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/index';
import { DragDropContext } from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';
//import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import AutorenewIcon from 'material-ui/svg-icons/action/autorenew';
import ModeEditIcon from 'material-ui/svg-icons/editor/mode-edit';
import RaisedButton from 'material-ui/RaisedButton';
import PieChartIcon from 'material-ui/svg-icons/editor/pie-chart';
import LineIcon from 'material-ui/svg-icons/editor/show-chart';
import GroupIcon from 'material-ui/svg-icons/editor/multiline-chart';
import BarIcon from 'material-ui/svg-icons/action/assessment';
import NavigationIcon from 'material-ui/svg-icons/navigation/menu';
import GridOnIcon from 'material-ui/svg-icons/image/grid-on';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import WidgetContainer from '../../components/dashboard/WidgetContainer';
import WidgetContainerStore from '../../components/dashboard/stores/WidgetContainerStore';
import '../../styles/dashboard.css';
//import { Row, Column } from '../../components/layout/gridSystem';
import DashboardEditStore from './stores/DashboardEditStore';
//import { dashboardService } from '../../services/Services';
import SourceWidgetItem from './SourceWidgetItem';
import Utils from '../../utils';
import ValidationStore from '../../components/validation/validationStore';
import * as ValidationEngine from '../../components/validation/validationEngine';
import TextFieldIcon from '../../components/inputs/TextFieldIcon';
import Palette from '../../Palette';


const dashboardEditStyle = {
  titleDescription: {},
  paper: {
    width: '100%',
    padding: '0px',
  },
  widgetListStyle: {
    width: '100%',
    marginTop: '40px',
    position: 'absolute',
    zIndex: '99999',
  },
  widgetIcons: {
    width: 24,
    height: 24,
    color: 'black'
  },
  drawerStyle: {
    position: 'absolute',
    zIndex: '2',
  },
  formTitle: {
    marginLeft: '0px'
  },
  saveButtonStyle: {
    margin: 0,
    top: 100,
    right: 30,
    position: 'fixed',
    zIndex: 1000
  },
  saveButton: {
    padding: 0,
    margin: 3
  },
  containerDragAndDrop: {
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: 'rgb(255, 255, 255)',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    boxSizing: 'border-box',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
    borderRadius: '2px',
    width: '100%',
    marginTop: '10px',
    position: 'relative',
    padding: 10
  },
  widgetContainer: {
    height: 250
  },
  dividerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginLeft: '10px',
    width: '90%',
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
  queryName: {
    color: Palette.infoCard.titleTextColor,
    fontSize: '24px',
    fontWeight: 'bold',
  },
  iconAndTitle: {
    display: 'flex',
    flexDirection: 'row',
    float: 'left',
    marginLeft: '7px',
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
};

@inject('dashboardListStore')
@inject('snackBarStore')
@inject('dashboardService')
@observer
class DashboardEdit extends Component {

  constructor(props) {
    super(props);
    this.widgetContainerStore = new WidgetContainerStore();
    this.dashboardEditStore = new DashboardEditStore(this.props.dashboardService, this.widgetContainerStore, this.props.snackBarStore);

    this.validationStore = new ValidationStore();

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
      }
    };

    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.nameValidationProps);
    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.descriptionValidationProps);
  }

  componentDidMount() {
    this.dashboardEditStore.get(this.props.params.id);
  }

  handleNameChange = (props, e) => {
    this.dashboardEditStore.dashboardName = e.target.value;
    ValidationEngine.validateRules(this.validationStore, e.target.value, props.parentId, props.fieldId, props.name);
  };

  handleDescriptionChange = (props, e) => {
    this.dashboardEditStore.dashboardDescription = e.target.value;
    ValidationEngine.validateRules(this.validationStore, e.target.value, props.parentId, props.fieldId, props.name);
  };

  updateDashboard = () => {
    const widgets = [];
    this.widgetContainerStore.widgetItems.forEach((widget) => {
      const queryParam = [];
      widget.queryParameters.forEach((param) => {
        queryParam.push({
          name: param.name,
          value: param.value,
          type: param.type
        });
      });
      widgets.push({
        title: widget.widgetTitle,
        widgetType: widget.widgetType,
        graph: widget.graph,
        queryId: widget.queryId,
        layout: widget.positionsAndDimensionsLayout,
        queryParameters: queryParam
      });
    });
    console.log('Saving widgets', widgets);
    this.dashboardEditStore.updateDashboard({
      id: this.dashboardEditStore.dashboardId,
      name: this.dashboardEditStore.dashboardName,
      description: this.dashboardEditStore.dashboardDescription,
      widgets
    })
    .then(() => {
      this.props.router.push('/dashboard/index');
    })
    .catch((error) => {
      this.props.snackBarStore.setMessage(error);
    });
  };

  isValid = () => {
    return (this.validationStore.errors.length === 0
                && this.dashboardEditStore.dashboardName !== ''
                && this.dashboardEditStore.dashboardDescription !== '');
  }

  handleOpenDrawer = () => {
    this.dashboardEditStore.isOpenDrawer = !this.dashboardEditStore.isOpenDrawer;
  };

  render() {
    return (
      <div>
        <div style={{ overflow: scroll }}>
          <Drawer
            containerStyle={{ backgroundColor: 'rgb(204, 204, 204)' }}
            style={dashboardEditStyle.drawerStyle}
            open={this.dashboardEditStore.isOpenDrawer}
            openSecondary
            width={200}
          >
            <List style={dashboardEditStyle.widgetListStyle}>
              <h4 style={{ textAlign: 'center', fontWeight: 'normal' }}>WIDGETS</h4>
              <Divider style={dashboardEditStyle.dividerStyle} />
              <div style={{ overflow: 'hidden', clear: 'both' }}>
                <SourceWidgetItem
                  type={this.widgetContainerStore.widgetTypes.GRID_TABLE}
                  primaryText="Cuadrícula de Datos"
                >
                  <GridOnIcon style={dashboardEditStyle.widgetIcons} />
                </SourceWidgetItem>
                <SourceWidgetItem
                  type={this.widgetContainerStore.widgetTypes.LINE_CHART}
                  primaryText="Gráfico Lineal"
                >
                  <LineIcon style={dashboardEditStyle.widgetIcons} />
                </SourceWidgetItem>
                <SourceWidgetItem
                  type={this.widgetContainerStore.widgetTypes.BAR_CHART}
                  primaryText="Gráfico de Barras"
                >
                  <BarIcon style={dashboardEditStyle.widgetIcons} />
                </SourceWidgetItem>
                <SourceWidgetItem
                  type={this.widgetContainerStore.widgetTypes.PIE_CHART}
                  primaryText="Gráfico de Torta"
                >
                  <PieChartIcon style={dashboardEditStyle.widgetIcons} />
                </SourceWidgetItem>
                <SourceWidgetItem
                  type={this.widgetContainerStore.widgetTypes.GROUP_CHART}
                  primaryText="Gráfico de Grupo"
                >
                  <GroupIcon style={dashboardEditStyle.widgetIcons} />
                </SourceWidgetItem>
              </div>
            </List>
          </Drawer>
        </div>
        <div className="widgets-navigation-icon">
          <IconButton
            onClick={this.handleOpenDrawer}
            style={{ padding: 0, width: 0, height: 0, marginTop: 10 }}
          >
            <NavigationIcon />
          </IconButton>
        </div>

        <div className="dashboard-form-container">
          <div style={dashboardEditStyle.paper}>
            <div style={dashboardEditStyle.windowTitle}>
              EDITAR DASHBOARD
            </div>
            <Paper style={dashboardEditStyle.infoCard}>
              <form onSubmit={this.handleSubmit}>
                <div>
                  <div style={dashboardEditStyle.iconAndTitle}>
                    <div>
                      <DashboardIcon style={{ ...dashboardEditStyle.icons, paddingTop: '2px', width: 30, height: 30 }} />
                    </div>
                    <div style={{ marginLeft: '10px', width: '400px' }}>
                      <TextFieldIcon
                        fullWidth
                        underlineStyle={{ borderBottom: '1px solid #7EAAE3' }}
                        value={this.dashboardEditStore.dashboardName}
                        onChange={(e) => { this.handleNameChange(this.fieldsValidationProps.nameValidationProps, e); }}
                        onBlur={(e) => { this.handleNameChange(this.fieldsValidationProps.nameValidationProps, e); }}
                        inputStyle={{ ...dashboardEditStyle.infoCardTextBox, ...dashboardEditStyle.queryName, marginTop: '-10px' }}
                        icon={<ModeEditIcon />}
                        iconProps={{ iconStyle: { color: '#7EAAE3' } }}
                      />
                    </div>
                  </div>
                  <div style={dashboardEditStyle.extraIcons}>
                    <div>
                      <DeleteIcon style={{ ...dashboardEditStyle.iconsBG }} />
                    </div>
                  </div>
                  <div style={{ clear: 'both' }} />
                  <div>
                    <div style={{ ...dashboardEditStyle.infoCardDetailTextBoxContainer, width: '100%' }}>
                      <div style={dashboardEditStyle.infoCardDetailTextBoxTitle}>
                        DESCRIPCIÓN
                      </div>
                      <div>
                        <TextFieldIcon
                          fullWidth
                          underlineStyle={{ borderBottom: '1px solid #7EAAE3' }}
                          icon={<ModeEditIcon />}
                          iconProps={{ iconStyle: { color: '#7EAAE3' } }}
                          value={this.dashboardEditStore.dashboardDescription}
                          onChange={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                          onBlur={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                          inputStyle={{ ...dashboardEditStyle.infoCardTextBox }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </Paper>

            <div style={{ ...dashboardEditStyle.backBottom, float: 'left' }}>
              <FlatButton label="« VOLVER A DASHBOARD" onClick={() => { this.props.router.push('/dashboard/index'); }} />
            </div>

            <div style={{ float: 'right', marginBottom: '15px', marginTop: '15px' }}>
              <RaisedButton
                label="GUARDAR"
                icon={<AutorenewIcon />}
                backgroundColor="#F5683A"
                labelColor="#FFF"
                buttonStyle={{ width: '150px', borderRadius: 25 }}
                style={{ borderRadius: 25 }}
                onClick={() => { console.log('Guardar Dashboard'); }}
              />
            </div>
            <div style={{ clear: 'both' }} />
            {/*<form onSubmit={this.handleSubmit}>
              <Row>
                <Column style={{ width: '42%' }}>
                  <TextField
                    hintText="Nombre"
                    floatingLabelFixed
                    floatingLabelText="Nombre"
                    fullWidth
                    onChange={(e) => { this.handleNameChange(this.fieldsValidationProps.nameValidationProps, e); }}
                    onBlur={(e) => { this.handleNameChange(this.fieldsValidationProps.nameValidationProps, e); }}
                    errorText={this.fieldsValidationProps.nameValidationProps.customErrorText}
                    value={this.dashboardEditStore.dashboardName}
                  />
                </Column>
                <Column style={{ width: '42%' }}>
                  <TextField
                    hintText="Descripción"
                    floatingLabelFixed
                    floatingLabelText="Descripción"
                    fullWidth
                    onChange={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                    onBlur={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                    errorText={this.fieldsValidationProps.descriptionValidationProps.customErrorText}
                    value={this.dashboardEditStore.dashboardDescription}
                  />
                </Column>
                <Column style={{ width: '11%' }}>
                  <RaisedButton
                    label="Guardar"
                    primary
                    labelStyle={{ fontSize: 10, padding: 0 }}
                    buttonStyle={{ width: '100%' }}
                    style={{ marginTop: 15, minWidth: '80%' }}
                    disabled={!this.isValid()}
                    onClick={this.updateDashboard}
                  />
                </Column>
              </Row>
            </form>*/}
          </div>
          <WidgetContainer
            widgetContainerBehavior={{ isEditable: true, isResizable: true, isDraggable: true }}
            widgetContainerStore={this.widgetContainerStore}
            mode="editionMode"
          />
        </div>
      </div>
    );
  }

}

const exportDashboard = Utils.isMobile() !== null ? DragDropContext(TouchBackend({ enableMouseEvents: true }))(DashboardEdit) : DragDropContext(HTML5Backend)(DashboardEdit);
export default exportDashboard;
//export default DashboardEdit;
