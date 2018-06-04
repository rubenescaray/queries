import React, { Component } from 'react';

class WidgetContainer extends Component {
  render() {
    const containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 100%',
      height: '100%'
    };

    const h4Style = {
      margin: '0'
    };

    return (
      <div style={containerStyle}>
        <div>
          <h4 style={h4Style}>{this.props.title}</h4>
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default WidgetContainer;
