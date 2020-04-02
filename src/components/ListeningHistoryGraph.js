import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { groupBy } from 'lodash/collection';
import Typography from '@material-ui/core/Typography';

const ListeningHistoryGraph = ({ recentlyPlayed, trackMap }) => {
  const [graphData, setGraphData] = useState([]);
  const [stackedGraphData, setStackedGraphData] = useState([]);

  const getTracksByHour = () => {
    const tracksByHour = groupBy(recentlyPlayed, track =>
      new Date(track.played_at).getHours()
    );

    console.log('tracks by hour', tracksByHour);
    return Object.keys(tracksByHour).map(hour => {
      return {
        hour: parseInt(hour),
        totalMinutes: tracksByHour[hour].reduce(
          (a, b) => (a += trackMap[b.track_id].duration_ms / 60000),
          0
        ),
      };
    });
  };

  const getTracksByDayByHour = () => {
    const tracksByDay = groupBy(recentlyPlayed, track =>
      new Date(track.played_at).getDay()
    );

    console.log('tracks by day', tracksByDay);
    const tracksByDayByHour = Object.keys(tracksByDay).map(day => {
      return {
        day: day,
        tracksByHour: groupBy(tracksByDay[day], track =>
          new Date(track.played_at).getHours()
        ),
      };
    });

    tracksByDayByHour.forEach(dayObj => {
      dayObj.tracksByHour = Object.keys(dayObj.tracksByHour).map(hour => {
        return {
          hour: parseInt(hour),
          totalMinutes: dayObj.tracksByHour[hour].reduce(
            (a, b) => (a += trackMap[b.track_id].duration_ms / 60000),
            0
          ),
        };
      });
    });

    console.log('tracks by day by hour', tracksByDayByHour);
    return tracksByDayByHour;
  };

  useEffect(() => {
    setGraphData(getTracksByHour());
    setStackedGraphData(getTracksByDayByHour());
  }, [trackMap]);

  console.log('graph data', graphData, 'stacked data', stackedGraphData);

  return (
    <>
      {graphData.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="h2">TODO</Typography>
        </Grid>
      )}
    </>
  );
};

ListeningHistoryGraph.propTypes = {
  recentlyPlayed: PropTypes.array,
  trackMap: PropTypes.object,
};

export default ListeningHistoryGraph;
