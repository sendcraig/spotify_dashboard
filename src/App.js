import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { Button, Container, Grid } from '@material-ui/core';
import {
  AuthenticationContext,
  AuthenticationProvider,
} from './context/Authentication';
import RecentlyPlayed from './components/RecentlyPlayed';
import { getMe } from './spotify/spotifyApi';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  TrackHistoryContext,
  TrackHistoryProvider,
} from './context/TrackHistory';
import { isEmpty } from 'lodash/lang';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import { getTimestampMultiplier } from './util';

const App = () => {
  const { isLoggedIn } = useContext(AuthenticationContext);
  const [currentUser, setCurrentUser] = useState({});

  const { trackMap, getTrackHistory } = useContext(TrackHistoryContext);

  const [tracksToUse, setTracksToUse] = useState([]);

  const [timeRange, setTimeRange] = useState('5');
  const [timeScale, setTimeScale] = useState('day');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      getMe(setCurrentUser);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isEmpty(trackMap)) {
      fetchRecentlyPlayed();
    }
  }, [trackMap]);

  const fetchRecentlyPlayed = () => {
    setIsLoading(true);

    const afterTimestamp =
      Date.now() - parseInt(timeRange) * getTimestampMultiplier(timeScale);
    const trackHistoryForTimeRange = getTrackHistory(afterTimestamp);

    const tracks = trackHistoryForTimeRange.map(
      track => trackMap[track.track_id]
    );

    setTracksToUse(tracks);
    setIsLoading(false);
  };

  return (
    <Container>
      <Grid container spacing={3} justify="center">
        {!isLoggedIn ? (
          <Grid item xs={12}>
            <Typography variant="h5">
              Logging in... <CircularProgress />
            </Typography>
          </Grid>
        ) : (
          <>
            <Grid item xs={12}>
              <Typography variant="h3">
                Welcome {currentUser.display_name}!
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                {/*TODO - change time range to slider or select*/}
                <InputLabel htmlFor="time-range">Time range</InputLabel>
                <Input
                  id="time-range"
                  value={timeRange}
                  onChange={event => setTimeRange(event.target.value)}
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="time-scale">Time scale</InputLabel>
                <Select
                  native
                  value={timeScale}
                  onChange={event => setTimeScale(event.target.value)}
                >
                  <option value="hour">Hours</option>
                  <option value="day">Days</option>
                  <option value="week">Weeks</option>
                  <option value="month">Months</option>
                </Select>
              </FormControl>

              <Button onClick={fetchRecentlyPlayed}>
                Get recently played tracks
              </Button>
            </Grid>

            {isLoading ? (
              <Grid item xs={12} alignItems="center">
                <Typography variant="h5">Loading play history... 🎶</Typography>
              </Grid>
            ) : (
              <>
                <Grid item xs={12}>
                  <Typography variant="h3">Favorites</Typography>
                  <RecentlyPlayed tracks={tracksToUse} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h3">Graph</Typography>
                  <Typography variant="h5">TODO</Typography>
                </Grid>
              </>
            )}
          </>
        )}
      </Grid>
    </Container>
  );
};

const AppConsumer = props => (
  <AuthenticationProvider>
    <TrackHistoryProvider>
      <App {...props} />
    </TrackHistoryProvider>
  </AuthenticationProvider>
);

export default AppConsumer;
