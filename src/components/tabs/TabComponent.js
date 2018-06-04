import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import Palette from '../../Palette';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  tabs: {
    fontSize: '16px',
  },
  header: {
    height: '40px',
    backgroundColor: '#FFF',
    padding: '15px',
  },
  wrapper: {
    boxShadow: '0 -5px 5px -5px #CCC, 5px 0 5px -5px #999, 0 5px 5px -5px #999, -5px 0 5px -5px #999',
  },
  iconAndTitle: {
    display: 'flex'
  },
  tabComponentTitle: {
    color: Palette.tabs.tabComponentTitleTextColor,
    fontSize: '24px',
    fontWeight: 'bold',
  },
  inkBarStyle: {
    background: Palette.tabs.inkBarColor,
    height: '6px'
  }
};

export default class TabComponent extends React.Component {

  /*constructor(props) {
    super(props);
    this.state = {
      value: 'a',
    };
  }

  handleChange = (value) => {
    this.setState({
      value,
    });
  };*/

  render() {
    return (
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div style={styles.iconAndTitle}>
            <div>
              {this.props.tabTitleIcon}
            </div>
            <div style={{ paddingTop: '4px', marginLeft: '20px' }}>
              <label style={styles.tabComponentTitle}>{this.props.tabComponentTitle}</label>
            </div>
          </div>
        </div>
        <Tabs inkBarStyle={styles.inkBarStyle}>
          <Tab label={this.props.tabATitle} style={styles.tabs}>
            {this.props.tabAContent}
          </Tab>
          <Tab label={this.props.tabBTitle} style={styles.tabs}>
            {this.props.tabBContent}
          </Tab>
        </Tabs>
      </div>
    );
  }
}
