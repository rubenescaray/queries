import React, { Component } from 'react';
import { VictoryPie } from 'victory';


const GenericPieChart = () => {
  return (
    <VictoryPie
      colorScale={'qualitative'}
      data={[
        { x: 'Seguros de personales', y: 35 },
        { x: 'Seguros de patrimoniales', y: 40 },
        { x: 'Seguros de prestación de servicios', y: 25 }
      ]}
    />
  );
};

class PieChartWidget extends Component {
  render() {
    return (
      <GenericPieChart />
    );
  }
}

export default PieChartWidget;
