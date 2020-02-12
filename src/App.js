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
  getRecentlyPlayedTracks,
} from './spotify/spotifyApi';
import TrackTitle from './components/TrackTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

const App = () => {
  const { token, getAuthUrl } = useContext(AuthenticationContext);

  const [currentlyPlaying, setCurrentlyPlaying] = useState('');
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [timeRange, setTimeRange] = useState('2');

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  const fetchCurrentUser = () => {
    getMe(token, setCurrentUser);
  };

  const fetchCurrentlyPlaying = () => {
    getCurrentlyPlayingTrack(token, setCurrentlyPlaying);
  };

  const fetchRecentlyPlayed = () => {
    console.log('time range', timeRange);
    getRecentlyPlayedTracks(token, setRecentlyPlayed, timeRange);
  };

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

              {recentlyPlayed.length > 0 && (
                <Grid container spacing={2}>
                  <h4>Recently played:</h4>
                  {recentlyPlayed.map(item => (
                    <Grid item style={{ width: '100%' }}>
                      <TrackTitle
                        title={item.track.name}
                        artist={item.track.artists[0].name}
                        imageUrl={item.track.album.images[0].url}
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
