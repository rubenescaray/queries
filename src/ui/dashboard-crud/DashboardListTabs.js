import React from 'react';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import DashboardList from './DashboardList';
import TabComponent from '../../components/tabs/TabComponent';
import Palette from '../../Palette';

const styles = {
  tabTitleIcon: {
    color: Palette.tabs.tabTitleIconColor,
    width: '32px',
    height: '32px',
  }
};

class DashboardListTabs extends React.Component {
  render() {
    return (
      <div>
        <TabComponent
          tabComponentTitle="Dashboards"
          tabATitle="GENERALES"
          tabBTitle="RECIENTES"
          tabAContent={<DashboardList router={this.props.router} />}
          tabBContent={<DashboardList router={this.props.router} />}
          tabTitleIcon={<DashboardIcon style={styles.tabTitleIcon} />}
        />
      </div>
    );
  }
}

export default DashboardListTabs;
