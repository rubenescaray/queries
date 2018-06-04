import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui/svg-icons/action/settings';

const widgetStyle = {
  widgetHeader: {
    borderBottom: '1px solid #ccc'
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
    padding: 0
  },
  titleHeader: {
    fontSize: '0.875em'
  },
  containerStyle: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 100%',
    height: '100%'
  }
};

class Widget extends Component {
  render() {

    return (
      <div style={widgetStyle.containerStyle}>
        <div style={widgetStyle.widgetHeader}>
          <div style={widgetStyle.containerTitleHeader}>
            <span style={widgetStyle.titleHeader}>{this.props.title}</span>
          </div>
          <div style={widgetStyle.containerIconHeader}>
            <IconButton tooltip="Configurar Widget" style={widgetStyle.iconHeader}>
              <SettingsIcon />
            </IconButton>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default Widget;
