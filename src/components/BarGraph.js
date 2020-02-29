import React from 'react';
import PropTypes from 'prop-types';
import { VictoryBar, VictoryChart } from 'victory';

const BarGraph = ({ data, xAxis, yAxis }) => {
  console.log('trying to render graph', data, xAxis, yAxis);

  return (
    <VictoryChart domainPadding={20}>
      <VictoryBar data={data} x={xAxis} y={yAxis} />
    </VictoryChart>
  );
};

BarGraph.propTypes = {
  data: PropTypes.array.isRequired,
  xAxis: PropTypes.string.isRequired,
  yAxis: PropTypes.string.isRequired,
};

export default BarGraph;
