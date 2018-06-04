export const LineChartWidget = {
  axis: [
    {
      name: 'x',
      legend: '',
      dataSource: ''
    },
    {
      name: 'y',
      legend: '',
      dataSource: ''
    }
  ]
};

export const BarChartWidget = {
  axis: [
    { name: 'x',
      legend: '',
      dataSource: ''
    },
    {
      name: 'y',
      legend: '',
      dataSource: ''
    }
  ]
};

export const findAxisByName = (graphicRepresentacion, axisName) => {
  const axis = graphicRepresentacion.axis.find((a) => {
    return a.name === axisName;
  });
  return axis;
};
