import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/index';
import { DragDropContext } from 'react-dnd';
import ModeEditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import FlatButton from 'material-ui/FlatButton';
//import RaisedButton from 'material-ui/RaisedButton';
//import AutorenewIcon from 'material-ui/svg-icons/action/autorenew';
import HTML5Backend from 'react-dnd-html5-backend';
import Paper from 'material-ui/Paper';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import TextFieldIcon from '../../components/inputs/TextFieldIcon';
import WidgetContainer from '../../components/dashboard/WidgetContainer';
import WidgetContainerStore from '../../components/dashboard/stores/WidgetContainerStore';
import DashboardExecuteStore from './stores/DashboardExecuteStore';
//import { dashboardService } from '../../services/Services';
import Palette from '../../Palette';

const dashboardExecuteStyle = {
  paper: {
    borderTop: '1px solid #CCC',
    borderLeft: '1px solid #CCC',
    borderRight: '1px solid #CCC',
    borderBottom: '1px solid #CCC',
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: 'rgb(250, 250, 250)',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    boxSizing: 'border-box',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
    width: '100%',
    position: 'relative',
    padding: '10px',
  },
  titleDescription: {

  },
  windowTitle: {
    color: '#777',
    fontWeight: 'bold',
    marginLeft: '30px',
    boxSizing: 'border-box',
    fontSize: '16px',
    paddingBottom: '12px',
    paddingTop: '12px'
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

@DragDropContext(HTML5Backend)
@inject('snackBarStore')
@inject('dashboardService')
@observer
class DashboardExecute extends Component {

  constructor(props) {
    super(props);
    this.widgetContainerStore = new WidgetContainerStore();
    this.dashboardExecuteStore = new DashboardExecuteStore(this.props.dashboardService, this.widgetContainerStore, this.props.snackBarStore);
  }

  componentDidMount() {
    this.dashboardExecuteStore.get(this.props.params.id);
    //console.log('didMountExecute', this.props.params.id);
  }

  render() {
    //console.log('dasssss', this.dashboardExecuteStore.dashboard);
    const { name } = this.dashboardExecuteStore.dashboard;
    const { widgetTitles } = this.widgetContainerStore;
    return (
      <div>
        <div>
          <div style={dashboardExecuteStyle.windowTitle}>
            VER DASHBOARD
          </div>
          <Paper style={dashboardExecuteStyle.infoCard}>
            <form onSubmit={this.handleSubmit}>
              <div>
                <div style={dashboardExecuteStyle.iconAndTitle}>
                  <div>
                    <DashboardIcon style={{ ...dashboardExecuteStyle.icons, paddingTop: '2px', width: 30, height: 30 }} />
                  </div>
                  <div style={{ marginLeft: '10px', width: '400px' }}>
                    <TextFieldIcon
                      fullWidth
                      underlineStyle={{ borderBottom: '1px solid #7EAAE3' }}
                      value={name}
                      onChange={(e) => { this.handleNameChange(this.fieldsValidationProps.nameValidationProps, e); }}
                      onBlur={(e) => { this.handleNameChange(this.fieldsValidationProps.nameValidationProps, e); }}
                      inputStyle={{ ...dashboardExecuteStyle.infoCardTextBox, ...dashboardExecuteStyle.queryName, marginTop: '-10px' }}
                      icon={<ModeEditIcon />}
                      iconProps={{ iconStyle: { color: '#7EAAE3' } }}
                    />
                  </div>
                </div>
                <div style={dashboardExecuteStyle.extraIcons}>
                  <div>
                    <DeleteIcon style={{ ...dashboardExecuteStyle.iconsBG }} />
                  </div>
                </div>
                <div style={{ clear: 'both' }} />
                <div>
                  <div style={{ ...dashboardExecuteStyle.infoCardDetailTextBoxContainer, width: '100%' }}>
                    <div style={dashboardExecuteStyle.infoCardDetailTextBoxTitle}>
                      WIDGETS
                    </div>
                    <div>
                      <TextFieldIcon
                        fullWidth
                        underlineStyle={{ borderBottom: '1px solid #7EAAE3' }}
                        icon={<ModeEditIcon />}
                        iconProps={{ iconStyle: { color: '#7EAAE3' } }}
                        value={widgetTitles.slice().join(', ')}
                        onChange={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                        onBlur={(e) => { this.handleDescriptionChange(this.fieldsValidationProps.descriptionValidationProps, e); }}
                        inputStyle={{ ...dashboardExecuteStyle.infoCardTextBox }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Paper>
        </div>
        <div>
          <div style={{ ...dashboardExecuteStyle.backBottom, float: 'left' }}>
            <FlatButton label="« VOLVER A DASHBOARD" onClick={() => { this.props.router.push('/dashboard/index'); }} />
          </div>
          <div style={{ clear: 'both' }} />
        </div>
        {/*<div style={dashboardExecuteStyle.paper}>
          <span style={dashboardExecuteStyle.titleDescription}>Dashboard: {name}</span>
        </div>*/}
        <WidgetContainer
          widgetContainerBehavior={{ isEditable: false, isResizable: true, isDraggable: true }}
          widgetContainerStore={this.widgetContainerStore}
          mode="executionMode"
        />
      </div>
    );
  }

}

export default DashboardExecute;
