import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Axis from './Axis';

@observer
class GraphAxisDataMapper extends Component {
  componentDidMount = () => {
    /*this.props.store.options = this.props.options;
    this.props.store.loadProperties(this.props.mappedParameters, this.props.parameters);*/
  }

  /*componentWillReceiveProps(nextProps) {
    nextProps.store.loadProperties(nextProps.mappedParameters, nextProps.parameters);
  }*/

  handleChangeAxisFieldName = (axis, value) => {
    this.props.handleChangeAxisDataSource(axis, value);
  }

  handleChangeAxisLegend = (axis, value) => {
    this.props.handleChangeAxisLegend(axis, value);
  }

  render() {
    const fields = this.props.dashboardStore.schema.length > 0 ? this.props.dashboardStore.schema : [];
    return (
      <div>
        <h4>Ejes</h4>
        {this.props.axisMappings && this.props.axisMappings.axis && this.props.axisMappings.axis.map((axisMapping, i) => {
          return (
            <Axis
              key={i}
              {...axisMapping}
              fields={fields}
              handleChangeAxisDataSource={this.handleChangeAxisFieldName}
              handleChangeAxisLegend={this.handleChangeAxisLegend}
            />
          );
        })}
      </div>
    );
  }
}

export default GraphAxisDataMapper;
