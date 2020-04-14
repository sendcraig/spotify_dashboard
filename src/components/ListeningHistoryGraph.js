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
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Paper from '@material-ui/core/Paper';

const ListeningHistoryGraph = ({ tracks }) => {
  console.log('loading graph with tracks:', tracks.length);
  const { trackMap } = useContext(TrackHistoryContext);

  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    if (!isEmpty(trackMap)) {
      formatGraphData();
    }
  }, [trackMap, tracks]);

  const formatGraphData = () => {
    const tracksByDay = groupBy(tracks, track => {
      const date = new Date(track.played_at);
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    });

    let graphTracks = [];
    Object.keys(tracksByDay).forEach(day => {
      const minsPerDay = tracksByDay[day].reduce(
        (a, b) => (a += trackMap[b.track_id].duration_ms / 60000),
        0
      );

      const avgPopularity =
        tracksByDay[day].reduce(
          (a, b) => (a += trackMap[b.track_id].popularity),
          0
        ) / tracksByDay[day].length;

      graphTracks.push({
        day: day,
        minutes: minsPerDay,
        'avg popularity': avgPopularity,
      });
    });

    console.log('graph tracks', graphTracks);
    setGraphData(graphTracks);
  };

  return (
    <Grid container>
      {graphData.length > 0 && (
        <Grid item xs={12}>
          <Paper style={{ display: 'flex', height: 400 }}>
            <ResponsiveContainer>
              <LineChart
                data={graphData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="minutes" stroke="#8884d8" />
                <Line
                  type="monotone"
                  dataKey="avg popularity"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
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
