import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/index';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DashboardStore from './stores/DashboardStore';
import ParameterValuesStore from '../parameter-values/stores/ParameterValuesStore';
import ValidationStore from '../validation/validationStore';
import SelectFilterStore from '../select-filter/stores/SelectFilterStore';
import GridWidget from './GridWidget';
import LineChartWidget from './LineChartWidget';
import BarChartWidget from './BarChartWidget';
import PieChartWidget from './PieChartWidget';
import GroupChartWidget from './GroupChartWidget';
import WidgetEditor from './WidgetEditor';


const widgetStyle = {
  widgetHeader: {
    borderBottom: '1px solid #ccc',
    padding: 5,
    backgroundColor: 'rgb(204, 204, 204)',
    fontWeight: 'bold',
    color: 'rgb(104, 104, 104)'
  },
  containerTitleHeader: {
    float: 'left',
    marginTop: 3,
    marginLeft: 3
  },
  containerIconHeader: {
    float: 'right',
    marginRight: 7
  },
  iconHeader: {
    width: 18,
    height: 18,
    padding: 0,
    marginLeft: 10,
    color: 'rgb(104, 104, 104)',
  },
  titleHeader: {
    fontSize: '0.875em'
  },
  containerStyle: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 100%',
    height: '100%',
    backgroundColor: 'white',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
  },
  dialogStyle: {
    height: '90%',
    width: '60%',
    maxWidth: 'none'
  }
};
@inject('snackBarStore')
@inject('dashboardService')
@inject('queryService')
@observer
class Widget extends Component {

  constructor(props) {
    super(props);
    //console.log('CONSTRUCTOR');
    this.containerBehavior = this.props.widgetContainerBehavior;
    this.parameterValuesStore = new ParameterValuesStore();
    this.validationStore = new ValidationStore();
    this.selectFilterStore = new SelectFilterStore();
    this.dashboardStore = new DashboardStore(this.props.dashboardService, this.props.queryService, this.parameterValuesStore, this.selectFilterStore, this.props.snackBarStore);
    this.dashboardStore.dataWidget = this.props.dataWidget;
  }

  componentDidMount() {
    if (this.props.widgetMode === 'creationMode' || this.props.widgetMode === 'editionMode') {
      this.dashboardStore.fetchQueries();
    }
      //console.log('this.props.dataWidget.queryId', this.props.dataWidget.queryId);
      //console.log('this.props.dataWidget', this.props.dataWidget);

    if (this.props.dataWidget.queryId !== '') {
      this.dashboardStore.executeQueryByIdAndFillParamFilters(this.props.dataWidget.queryId);
    }
    this.dashboardStore.widgetTitle = this.dashboardStore.dataWidget.widgetTitle;
  }

  getWidgetComponent = (widgetType) => {
    return (this.renderWidgetType[widgetType](Object.assign({})));
  };

  handleOpenDialog = () => {
    this.dashboardStore.isOpenDialog = true;
  };

  handleDeleteWidget = (widgetItemId) => {
    this.props.widgetContainerStore.removeWidgetItem(widgetItemId);
  };

  handleCloseDialog = () => {
    this.dashboardStore.isOpenDialog = false;
  };

  handleSubmitDialog = () => {
    this.dashboardStore.executeQuery(this.dashboardStore.query);
    const parameters = this.dashboardStore.queryParameters;
    //console.log('PARAMETERS', parameters);
    this.props.dataWidget.setQueryParameters(parameters);
    this.handleCloseDialog();
  };

  handleChangeAutocomplete = (value, index) => {
    const queryObject = this.dashboardStore.findQueryByIndex(index);
    console.log(value, index);
    //console.log('Query Seleccionado', queryObject);
    //console.log('Value: ', value);
    this.dashboardStore.executeQueryByIdAndFillParamFilters(queryObject.id);
    this.dashboardStore.queryName = value;
    this.props.dataWidget.setQueryId(queryObject.id);
  };

  handleTitle = (e) => {
    this.dashboardStore.widgetTitle = e.target.value;
    this.props.dataWidget.setWidgetTitle(e.target.value);
  };

  handleChangeWidgedType = (value) => {
    this.props.widgetContainerStore.setWidgetType(this.props.dataWidget.i, value);
  }

  handleChangeWidgetGraphAxisLegend = (axis, legend) => {
    this.props.widgetContainerStore.setWidgetGraphAxisLegend(this.props.dataWidget.i, axis, legend);
  }

  handleChangeWidgetGraphAxisDataSource = (axis, dataSource) => {
    this.props.widgetContainerStore.setWidgetGraphAxisDataSource(this.props.dataWidget.i, axis, dataSource);
  }

  updateGrid = () => {

  };

  renderWidgetType = {
    GridWidget: () => {
      return (<GridWidget dashboardStore={this.dashboardStore} selectFilterStore={this.selectFilterStore} />);
    },
    LineChartWidget: () => {
      return (<LineChartWidget dashboardStore={this.dashboardStore} />);
    },
    BarChartWidget: () => {
      return (<BarChartWidget dashboardStore={this.dashboardStore} />);
    },
    PieChartWidget: () => {
      return (<PieChartWidget />);
    },
    GroupChartWidget: () => {
      return (<GroupChartWidget />);
    }
  };

  render() {
    const widgetComponent = this.getWidgetComponent(this.props.dataWidget.widgetType);
    const dataQuery = this.dashboardStore.queries.map((data) => {
      return data.name;
    });
    const actions = [
      <FlatButton
        label="Cancelar"
        primary
        onClick={this.handleCloseDialog}
      />,
      <FlatButton
        label="Guardar"
        primary
        onClick={this.handleSubmitDialog}
      />,
    ];
    const titleDialog = `Configuración del Widget ${this.dashboardStore.widgetTitle}`;
    if (this.containerBehavior.isEditable) {
      return (
        <div style={widgetStyle.containerStyle}>
          <div style={widgetStyle.widgetHeader}>
            <div style={widgetStyle.containerTitleHeader}>
              <span style={widgetStyle.titleHeader}>{this.dashboardStore.widgetTitle}</span>
            </div>
            <div style={widgetStyle.containerIconHeader}>
              <IconButton tooltip="Configurar Widget" style={widgetStyle.iconHeader} iconStyle={{ color: 'rgb(104, 104, 104)' }} onClick={this.handleOpenDialog}>
                <SettingsIcon />
              </IconButton>
              <IconButton tooltip="Eliminar Widget" style={widgetStyle.iconHeader} iconStyle={{ color: 'rgb(104, 104, 104)' }} onClick={this.handleDeleteWidget.bind(this, this.props.dataWidget.i)}>
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
          {widgetComponent}
          <Dialog
            title={titleDialog}
            actions={actions}
            modal
            open={this.dashboardStore.isOpenDialog}
            onRequestClose={this.handleCloseDialog}
            autoScrollBodyContent
            contentStyle={widgetStyle.dialogStyle}
          >
            <WidgetEditor
              onHandleTitle={this.handleTitle}
              onHandleChangeAutocomplete={this.handleChangeAutocomplete}
              handleChangeWidgetType={this.handleChangeWidgedType}
              handleChangeWidgetGraphAxisDataSource={(axis, dataSource) => { this.handleChangeWidgetGraphAxisDataSource(axis, dataSource); }}
              handleChangeWidgetGraphAxisLegend={(axis, legend) => { this.handleChangeWidgetGraphAxisLegend(axis, legend); }}
              dashboardStore={this.dashboardStore}
              validationStore={this.validationStore}
              parameterValuesStore={this.parameterValuesStore}
              selectFilterStore={this.selectFilterStore}
              updateGrid={this.updateGrid}
              dataQuery={dataQuery}
              widgetType={this.props.dataWidget.widgetType}
              axisMappings={this.props.dataWidget.graph}
            />
          </Dialog>
        </div>
      );
    }

    // execution mode
    return (
      <div style={widgetStyle.containerStyle}>
        <div style={widgetStyle.widgetHeader}>
          <div style={widgetStyle.containerTitleHeader}>
            <span style={widgetStyle.titleHeader}>{this.dashboardStore.dataWidget.widgetTitle}</span>
          </div>
        </div>
        {widgetComponent}
      </div>
    );
  }
}
//TestComment
export default Widget;
