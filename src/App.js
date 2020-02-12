import React, {useEffect, useState} from 'react';
import './App.css';
import {Button, Container, Grid} from "@material-ui/core";
import {hash} from "./spotify/authenicate";
import SpotifyWebApi from "spotify-web-api-js";
import SongTitle from "./components/SongTitle";


const App = () => {
    const authorizationEndpoint = "https://accounts.spotify.com/authorize";
    const clientId = "664624fb8bb640fb8b69b4d3e6a18d12";
    const scopes = ["user-read-private", "user-read-currently-playing", "user-read-playback-state", "user-read-recently-played"];
    const responseType = "token";
    const redirectUri = "http://localhost:7000";

    const [token, setToken] = useState(hash.access_token);
    const [currentlyPlaying, setCurrentlyPlaying] = useState('');
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);

    const spotifyApi = new SpotifyWebApi();

    const getAuthUrl = () => {
        return `${authorizationEndpoint}?client_id=${clientId}&response_type=${responseType}&scope=${scopes.join('%20')}&redirect_uri=${redirectUri}`;
    };

    const getCurrentlyPlaying = () => {
        spotifyApi.setAccessToken(token);
        spotifyApi.getMyCurrentPlayingTrack()
            .then(res => {
                setCurrentlyPlaying(res);
            });
    };

    const getRecentlyPlayed = () => {
        spotifyApi.setAccessToken(token);
        spotifyApi.getMyRecentlyPlayedTracks({
            after: Date.now() - (3600000 * 24)
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
                          <p>
                              User is {!token && `not`} logged in.
                          </p>
                      </Grid>
                      <Grid item>
                          <Button href={getAuthUrl()}>Click to log in</Button>
                      </Grid>
                      {token && (
                          <Grid item>
                              <Button onClick={getCurrentlyPlaying}>Get currently playing song</Button>

                              {currentlyPlaying && (
                                  <Grid>
                                      <h4>Now playing:</h4>
                                      <SongTitle song={currentlyPlaying}/>
                                      <img src={currentlyPlaying.item.album.images[0].url}/>
                                  </Grid>
                              )}
                          </Grid>
                      )}

                      {token && (
                          <Grid item>
                              <Button onClick={getRecentlyPlayed}>Get recently played tracks</Button>

                              {recentlyPlayed.length > 0 && (
                                  <Grid>
                                      <h4>Recently played:</h4>
                                      {recentlyPlayed.map(item => (
                                          <p>{item.track.name} by {item.track.artists[0].name}</p>
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

export default App;
