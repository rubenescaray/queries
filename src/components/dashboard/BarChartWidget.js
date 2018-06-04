import React, { Component } from 'react';
import { observer } from 'mobx-react/index';
import { VictoryChart, VictoryBar, VictoryTheme/*, VictoryAxis*/ } from 'victory';

class GenericBarChart extends Component {
  render() {
    const { data, axis } = this.props;
    const graphData = [];
    const xAxis = axis.find((a) => {
      return a.name === 'x';
    });
    const yAxis = axis.find((a) => {
      return a.name === 'y';
    });
    data.forEach((dataElement) => {
      const graphDataElement = {
        x: dataElement[xAxis.dataSource],
        y: dataElement[yAxis.dataSource]
      };
      graphData.push(graphDataElement);
    });
    return (
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={13}
      >
        <VictoryBar
          style={{ data: { fill: '#c43a31' } }}
          alignment="start"
          data={graphData}
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 }
          }}
        />
      </VictoryChart>
    );
  }
}

@observer
class BarChartWidget extends Component {
  render() {
    const { dashboardStore } = this.props;
    return (
      <GenericBarChart data={dashboardStore.results} axis={dashboardStore.dataWidget.graph.axis} />
    );
  }
}

export default BarChartWidget;
