import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/index';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import Drawer from 'material-ui/Drawer';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentSave from 'material-ui/svg-icons/content/save';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-table/react-table.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Row, Column } from '../../components/layout/gridSystem';
import DashboardFormStore from './stores/DashboardFormStore';
import WidgetStore from './widgets/stores/WidgetStore';
import WidgetContainer from './widgetContainer';
//import { dashboardService } from '../../services/Services';
import Utils from '../../utils';
import '../../styles/react-grid-layout.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const dashboardFormStyle = {
  paper: {
    width: '100%',
    padding: '20px',
  },
  widgetListStyle: {
    width: '100%',
    marginTop: '100px',
    position: 'absolute',
    zIndex: '99999'
  },
  drawerStyle: {
    position: 'absolute',
    zIndex: '2'
  },
  formContainer: {
    marginLeft: '240px'
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
  gridLayoutStyle: {
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0
  },
  divGridLayoutContainerStyle: {
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: 'rgb(255, 255, 255)',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    boxSizing: 'border-box',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
    borderRadius: '2px',
    width: '100%',
    marginTop: '10px'
  },
  widgetItemStyle: {
    marginLeft: '0px'
  }
};

@inject('dashboardListStore')
@inject('dashboardService')
@observer
class DashboardForm extends Component {

  constructor(props) {
    super(props);
    this.gridLayoutId = Utils.getNewId();
    this.dashboardFormStore = new DashboardFormStore(this.props.dashboardService, this.props.snackBarStore);
    this.widgetStore = new WidgetStore();
  }

  onAddItem = (widgetType) => {
    this.widgetStore.addWidgetItem(widgetType);
  };

  onBreakpointChange = (breakpoint, cols) => {
    this.widgetStore.breakpointChange(breakpoint, cols);
  };

  onLayoutChange = (layout) => {
    console.log('LAYOUT: ', layout);
    this.widgetStore.layoutChange(layout);
  }

  onRemoveItem = (i) => {
    this.widgetStore.removeWidgetItem(i);
  }

  onResize(layout, oldLayoutItem, layoutItem, placeholder) {
    // `oldLayoutItem` contains the state of the item before the resize.
    // You can modify `layoutItem` to enforce constraints.
    const layoutItemAux = layoutItem;
    const placeholderAux = placeholder;
    if (layoutItemAux.w < 4) {
      layoutItemAux.w = 4;
      placeholderAux.w = 4;
    }
    if (layoutItemAux.h < 4 || layoutItemAux.h > 4) {
      layoutItemAux.h = 4;
      placeholderAux.h = 4;
    }
  }

  createWidgetComponent = {
    gridTable: (props) => {
      return (
        <div key={props.i} data-grid={props.component} style={dashboardFormStyle.widgetItemStyle}>
          <WidgetContainer title={'Grid Table Widget'} />
        </div>
      );
    },
    lineChart: (props) => {
      console.log(props);
      return (
        <div key={props.i} data-grid={props.component} style={dashboardFormStyle.widgetItemStyle}>
          <WidgetContainer title={'Line Chart Widget'} />
        </div>
      );
    }
  }

  generateDOM = () => {
    return this.widgetStore.widgetItems.map((widgetComponent, key, widgetItems) => {
      return (this.createWidgetComponent[widgetComponent.type](Object.assign({}, { i: widgetComponent.i, component: widgetComponent }, widgetItems)));
    });
  };

  render() {
    return (
      <div>
        <div>
          <Drawer style={dashboardFormStyle.drawerStyle} open>
            <List style={dashboardFormStyle.widgetListStyle}>
              <Subheader>Lista de Widgets</Subheader>
              <Divider />
              <ListItem
                onClick={this.onAddItem.bind(this, this.widgetStore.widgetTypes.GRID_TABLE)}
                leftAvatar={<Avatar icon={<FileFolder />} />}
                primaryText="Cuadrícula de Datos"
                secondaryText={
                  <p>
                    Agrega Widget con Cuadrícula de Datos.
                  </p>
                }
                secondaryTextLines={2}
              />
              <Divider />
              <ListItem
                onClick={this.onAddItem.bind(this, this.widgetStore.widgetTypes.LINE_CHART)}
                leftAvatar={<Avatar icon={<FileFolder />} />}
                primaryText="Gráfico Lineal"
                secondaryText={
                  <p>
                    Agrega Widget con Gráfico Lineal.
                  </p>
                }
                secondaryTextLines={2}
              />
              <Divider />
            </List>
          </Drawer>
        </div>
        <div style={dashboardFormStyle.formContainer}>
          <h2 style={dashboardFormStyle.formTitle}>Nuevo Dashboard</h2>
          <FloatingActionButton style={dashboardFormStyle.saveButtonStyle} mini default>
            <ContentSave />
          </FloatingActionButton>
          <Paper style={dashboardFormStyle.paper}>
            <form onSubmit={this.handleSubmit}>
              <Row>
                <Column>
                  <TextField
                    hintText="Nombre del Dashboard"
                    floatingLabelFixed
                    floatingLabelText="Nombre del Dashboard"
                    fullWidth
                  />
                </Column>
                <Column>
                  <TextField
                    hintText="Descripción del Dashboard"
                    floatingLabelFixed
                    floatingLabelText="Descripción del Dashboard"
                    fullWidth
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <label style={{ fontSize: '0.875em' }}>Haga click en un Widget de la Lista de Widgets para agregarlo al Dashboard</label>
                </Column>
              </Row>
            </form>
          </Paper>
          <div style={dashboardFormStyle.divGridLayoutContainerStyle}>
            <ResponsiveReactGridLayout
              id={this.gridLayoutId}
              style={dashboardFormStyle.gridLayoutStyle}
              onLayoutChange={this.onLayoutChange}
              onBreakpointChange={this.onBreakpointChange}
              onResize={this.onResize}
              {...this.widgetStore.widgetProps}
            >
              {this.generateDOM()}
            </ResponsiveReactGridLayout>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardForm;
