import React, { Component } from 'react';
import { observer } from 'mobx-react/index';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory';

class GenericLineChart extends Component {
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
      >

        <VictoryLine
          style={{
            visible: 'flex',
            width: '100%',
            data: { stroke: '#c43a31' },
            parent: { border: '1px solid #ccc' }
          }}
          data={graphData}
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 }
          }}
          //labels={(datum) => { return datum.y; }}
        />
        <VictoryAxis
          theme={VictoryTheme.material}
          standalone={false}
          label={xAxis.legend}
        />
        <VictoryAxis
          dependentAxis
          theme={VictoryTheme.material}
          standalone={false}
          label={yAxis.legend}
        />
      </VictoryChart>
    );
  }
}
@observer
class LineChartWidget extends Component {
  render() {
    const { dashboardStore } = this.props;
    return (
      <GenericLineChart data={dashboardStore.results} axis={dashboardStore.dataWidget.graph.axis} />
    );
  }
}

export default LineChartWidget;
