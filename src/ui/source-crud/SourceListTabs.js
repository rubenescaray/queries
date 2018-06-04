import React from 'react';
//import TabTitleIcon from 'material-ui/svg-icons/action/chrome-reader-mode';
import SourceIcon from 'material-ui/svg-icons/action/dns';
import SourceList from './SourceList';
import TabComponent from '../../components/tabs/TabComponent';
import Palette from '../../Palette';

const styles = {
  tabTitleIcon: {
    color: Palette.tabs.tabTitleIconColor,
    width: '32px',
    height: '32px',
  }
};

class SourceListTabs extends React.Component {
  render() {
    return (
      <div>
        <TabComponent
          tabComponentTitle="Orígenes De Datos"
          tabATitle="GENERALES"
          tabBTitle="RECIENTES"
          tabAContent={<SourceList router={this.props.router} />}
          tabBContent={<SourceList router={this.props.router} />}
          tabTitleIcon={<SourceIcon style={styles.tabTitleIcon} />}
        />
      </div>
    );
  }
}

export default SourceListTabs;
