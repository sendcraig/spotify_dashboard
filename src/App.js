import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { Button, Container, Grid } from '@material-ui/core';
import {
  AuthenticationContext,
  AuthenticationProvider,
} from './context/Authentication';
import Login from './components/Login';
import {
  getCurrentlyPlayingTrack,
  getMe,
  getTracks,
} from './spotify/spotifyApi';
import TrackTitle from './components/TrackTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { groupBy, orderBy } from 'lodash/collection';
import BarGraph from './components/BarGraph';

const App = () => {
  const { token, getAuthUrl } = useContext(AuthenticationContext);

  const [currentlyPlaying, setCurrentlyPlaying] = useState('');
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [timeRange, setTimeRange] = useState('2');
  const [trackMap, setTrackMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [stackedGraphData, setStackedGraphData] = useState([]);

  useEffect(() => {
    if (token) {
      getMe(token, setCurrentUser);
    }
  }, [token]);

  const fetchCurrentlyPlaying = () => {
    getCurrentlyPlayingTrack(token, setCurrentlyPlaying);
  };

  const fetchRecentlyPlayed = () => {
    const afterTimestamp = Date.now() - parseInt(timeRange) * 3600000;
    // TODO - use axios, extract to API client file
    setIsLoading(true);

    fetch(
      `https://3nijghj1c7.execute-api.eu-central-1.amazonaws.com/prod/?after_timestamp=${afterTimestamp}`
    )
      .then(res => res.json())
      .then(data => {
        console.log('Successfully called AWS for play history ', data);

        const trackIds = data.map(entry => entry.track_id);
        getTracks(token, trackIds, mapRecentlyPlayedTracks);

        const sortedData = orderBy(data, 'played_at', 'desc');
        setRecentlyPlayed(sortedData);
      })
      .catch(err => {
        console.log('Error calling AWS', err);
      });
  };

  const mapRecentlyPlayedTracks = tracks => {
    const recentlyPlayedMap = tracks.reduce((map, obj) => {
      map[obj.id] = obj;
      return map;
    }, {});

    // TODO - cache this or something (don't just store in memory)
    setTrackMap({ ...trackMap, ...recentlyPlayedMap });
    setIsLoading(false);
  };

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

  return (
    <Container fixed>
      <Grid container spacing={2} justify="center">
        <Grid item xs={12}>
          {!token && (
            <>
              <p>User is not logged in!</p>
              <Login getAuthUrl={getAuthUrl} />
            </>
          )}
          {Object.keys(currentUser).length > 0 && (
            <h2>Welcome {currentUser.display_name}!</h2>
          )}
        </Grid>
        {token && graphData.length > 0 && (
          <Grid item xs={12}>
            <BarGraph
              data={graphData}
              xAxis="hour"
              yAxis="totalMinutes"
              isStacked={false}
            />
          </Grid>
        )}
        {token && stackedGraphData.length > 0 && (
          <Grid item xs={12}>
            <BarGraph
              data={stackedGraphData}
              xAxis="hour"
              yAxis="totalMinutes"
              isStacked={true}
            />
          </Grid>
        )}

        <Grid item xs={6}>
          {token && (
            <Grid item>
              <Button onClick={fetchCurrentlyPlaying}>
                Get currently playing song
              </Button>

              {currentlyPlaying && (
                <Grid>
                  <h4>Now playing:</h4>
                  <TrackTitle
                    title={currentlyPlaying.item.name}
                    artist={currentlyPlaying.item.artists[0].name}
                    imageUrl={currentlyPlaying.item.album.images[0].url}
                  />
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
        <Grid item xs={6}>
          {token && (
            <Grid item>
              {/*TODO - change time range to slider or select*/}
              <FormControl>
                <InputLabel htmlFor="time-range">
                  Time range in hours
                </InputLabel>
                <Input
                  id="time-range"
                  value={timeRange}
                  onChange={event => setTimeRange(event.target.value)}
                />
              </FormControl>

              <Button onClick={fetchRecentlyPlayed}>
                Get recently played tracks
              </Button>

              {!isLoading && (
                <Grid container spacing={2}>
                  <h4>Recently played:</h4>
                  {recentlyPlayed.map(track => (
                    <Grid item style={{ width: '100%' }}>
                      <p>{new Date(track.played_at).toLocaleString('en-US')}</p>
                      <TrackTitle
                        title={trackMap[track.track_id].name}
                        artist={trackMap[track.track_id].artists[0].name}
                        imageUrl={trackMap[track.track_id].album.images[0].url}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

const AppConsumer = props => (
  <AuthenticationProvider>
    <App {...props} />
  </AuthenticationProvider>
);

export default AppConsumer;
