import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { Button, Container, Grid } from '@material-ui/core';
import SpotifyWebApi from 'spotify-web-api-js';
import SongTitle from './components/SongTitle';
import {
  AuthenticationContext,
  AuthenticationProvider,
} from './context/Authentication';

const App = () => {
  const { token, getAuthUrl } = useContext(AuthenticationContext);

  const [currentlyPlaying, setCurrentlyPlaying] = useState('');
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  const spotifyApi = new SpotifyWebApi();

  const getCurrentlyPlaying = () => {
    spotifyApi.setAccessToken(token);
    spotifyApi.getMyCurrentPlayingTrack().then(res => {
      setCurrentlyPlaying(res);
    });
  };

  const getRecentlyPlayed = () => {
    spotifyApi.setAccessToken(token);
    spotifyApi
      .getMyRecentlyPlayedTracks({
        after: Date.now() - 3600000 * 24,
      })
      .then(res => {
        console.log(`recently played (${res.items.length})`, res.items);
        setRecentlyPlayed(res.items);
      });
  };

  useEffect(() => {
    getCurrentlyPlaying(token, setCurrentlyPlaying);
  }, [token]);

  return (
    <Container fixed>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container direction="column" justify="center" spacing={4}>
            <Grid item>
              <p>User is {!token && 'not'} logged in.</p>
            </Grid>
            <Grid item>
              <Button href={getAuthUrl()}>Click to log in</Button>
            </Grid>
            {token && (
              <Grid item>
                <Button onClick={getCurrentlyPlaying}>
                  Get currently playing song
                </Button>

                {currentlyPlaying && (
                  <Grid>
                    <h4>Now playing:</h4>
                    <SongTitle song={currentlyPlaying} />
                    <img src={currentlyPlaying.item.album.images[0].url} />
                  </Grid>
                )}
              </Grid>
            )}

            {token && (
              <Grid item>
                <Button onClick={getRecentlyPlayed}>
                  Get recently played tracks
                </Button>

                {recentlyPlayed.length > 0 && (
                  <Grid>
                    <h4>Recently played:</h4>
                    {recentlyPlayed.map(item => (
                      <p>
                        {item.track.name} by {item.track.artists[0].name}
                      </p>
                    ))}
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>
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
