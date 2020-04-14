import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { groupBy } from 'lodash/collection';
import {
  TrackHistoryContext,
  TrackHistoryProvider,
} from '../context/TrackHistory';
import { isEmpty } from 'lodash/lang';
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { MONTHS } from '../util';

const ListeningHistoryGraph = ({ tracks }) => {
  const { trackMap } = useContext(TrackHistoryContext);

  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    if (!isEmpty(trackMap)) {
      formatGraphData();
    }
  }, [trackMap, tracks]);

  const formatGraphData = () => {
    // TODO - group by different time ranges
    const tracksByDay = groupBy(tracks, track => {
      const date = new Date(track.played_at);
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    });

    let graphTracks = [];
    Object.keys(tracksByDay).forEach(day => {
      // Add different metrics
      const minsPerDay = tracksByDay[day].reduce(
        (a, b) => (a += trackMap[b.track_id].duration_ms / 60000),
        0
      );

      const avgPopularity =
        tracksByDay[day].reduce(
          (a, b) => (a += trackMap[b.track_id].popularity),
          0
        ) / tracksByDay[day].length;

      // Then push onto graph data
      graphTracks.push({
        day: day,
        minutes: minsPerDay,
        'avg popularity': avgPopularity,
      });
    });

    console.log('graph tracks', graphTracks);
    setGraphData(graphTracks);
  };

  const formatDateTick = dateString => {
    const [day, month] = dateString.split('-');
    return `${MONTHS[month - 1]} ${day}`;
  };

  return (
    <Grid container>
      {graphData.length > 0 && (
        <Grid item xs={12}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={graphData}
              margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickFormatter={val => formatDateTick(val)}
                interval={Math.floor(graphData.length / 5)}
              >
                <Label position="bottom" style={{ textAnchor: 'middle' }}>
                  Day
                </Label>
              </XAxis>
              <YAxis>
                <Label
                  angle={270}
                  position="left"
                  style={{ textAnchor: 'middle' }}
                >
                  Value
                </Label>
              </YAxis>
              <Tooltip />
              <Line type="monotone" dataKey="minutes" stroke="#8884d8" />
              <Line type="monotone" dataKey="avg popularity" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      )}
    </Grid>
  );
};

ListeningHistoryGraph.propTypes = {
  tracks: PropTypes.array.isRequired,
};

const ListeningHistoryGraphConsumer = props => (
  <TrackHistoryProvider>
    <ListeningHistoryGraph {...props} />
  </TrackHistoryProvider>
);

export default ListeningHistoryGraphConsumer;
