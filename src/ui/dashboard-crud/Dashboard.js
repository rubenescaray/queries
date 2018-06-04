import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/index';
import Toggle from 'material-ui/Toggle';
import DashboardEdit from './DashboardEdit';
import DashboardExecute from './DashboardExecute';
import DashboardStore from './stores/DashboardStore';

const dashboardStyle = {
  toggle: {
    width: 250,
    clear: 'both',
    display: 'none',
  },
  thumbOff: {
    backgroundColor: 'rgb(9, 66, 124)',
  },
  trackOff: {
    backgroundColor: 'rgba(9, 66, 124, 0.5)',
  },
  thumbSwitched: {
    backgroundColor: 'rgb(9, 66, 124)',
  },
  trackSwitched: {
    backgroundColor: 'rgba(9, 66, 124, 0.5)',
  }
};

@inject('snackBarStore')
@observer
class Dashboard extends Component {

  constructor(props) {
    super(props);
    const { isEditing, id } = props.params;
    this.isEditing = isEditing;
    this.id = id;
    this.props = props;
    this.dashboardStore = new DashboardStore(isEditing);
    this.dashboardStore.checkedCurrentComponent(isEditing, <DashboardEdit {...props} />, <DashboardExecute {...props} />);
  }

  onToggleHandle = (e, isChecked) => {
    this.dashboardStore.changeToggleLabel(this.isEditing === 'true' ? !isChecked : isChecked);
    this.dashboardStore.checkedCurrentComponent(this.isEditing === 'true' ? !isChecked : isChecked, <DashboardEdit {...this.props} />, <DashboardExecute {...this.props} />);
  };

  render() {
    return (
      <div>
        <div style={dashboardStyle.toggle}>
          <Toggle
            label={this.dashboardStore.toggleLabel}
            labelPosition="right"
            onToggle={(e, isChecked) => { this.onToggleHandle(e, isChecked); }}
            thumbStyle={dashboardStyle.thumbOff}
            trackStyle={dashboardStyle.trackOff}
            thumbSwitchedStyle={dashboardStyle.thumbSwitched}
            trackSwitchedStyle={dashboardStyle.trackSwitched}
          />
        </div>
        {this.dashboardStore.currentComponent}
      </div>
    );
  }
}

export default Dashboard;
