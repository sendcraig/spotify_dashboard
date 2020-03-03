import React from 'react';
import PropTypes from 'prop-types';
import { VictoryBar, VictoryChart, VictoryStack } from 'victory';

const BarGraph = ({ data, xAxis, yAxis, isStacked = false }) => {
  console.log('trying to render graph', data, xAxis, yAxis, isStacked);

  return (
    <VictoryChart domainPadding={20}>
      {isStacked && (
        <VictoryStack>
          {data.map(graphData => {
            return (
              <VictoryBar data={graphData.tracksByHour} x={xAxis} y={yAxis} />
            );
          })}
        </VictoryStack>
      )}
      {!isStacked && <VictoryBar data={data} x={xAxis} y={yAxis} />}
    </VictoryChart>
  );
};

BarGraph.propTypes = {
  data: PropTypes.array.isRequired,
  xAxis: PropTypes.string.isRequired,
  yAxis: PropTypes.string.isRequired,
  isStacked: PropTypes.string,
};

export default BarGraph;
