import React from 'react';
import QueryIcon from 'material-ui/svg-icons/action/chrome-reader-mode';
import QueryList from './QueryList';
import TabComponent from '../../components/tabs/TabComponent';
import Palette from '../../Palette';

const styles = {
  tabTitleIcon: {
    color: Palette.tabs.tabTitleIconColor,
    width: '32px',
    height: '32px',
  }
};

class QueryListTabs extends React.Component {
  
  render() {
    return (
      <div>
        <TabComponent
          tabComponentTitle="Consultas"
          tabATitle="GENERALES"
          tabBTitle="RECIENTES"
          tabAContent={<QueryList router={this.props.router} />}
          tabBContent={<QueryList router={this.props.router} />}
          tabTitleIcon={<QueryIcon style={styles.tabTitleIcon} />}
        />
      </div>
    );
  }
}

export default QueryListTabs;
