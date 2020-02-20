import SpotifyWebApi from 'spotify-web-api-js';
import axios from 'axios';
import { chunk } from 'lodash/array';

const spotifyApi = new SpotifyWebApi();

export const getMe = (token, callback) => {
  spotifyApi.setAccessToken(token);
  spotifyApi
    .getMe()
    .then(res => {
      callback(res);
    })
    .catch(err => {
      console.log('error fetching current user', err);
    });
};

export const getCurrentlyPlayingTrack = (token, callback) => {
  spotifyApi.setAccessToken(token);
  spotifyApi
    .getMyCurrentPlayingTrack()
    .then(res => {
      callback(res);
    })
    .catch(err => {
      console.log('error fetching currently playing track', err);
    });
};

export const getTracks = (token, trackIds, resolve) => {
  const makeRequest = (token, trackIdChunks, retrievedTracks, resolve) => {
    axios
      .get('https://api.spotify.com/v1/tracks/', {
        params: { ids: trackIdChunks.shift().join(',') },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        const allTracks = retrievedTracks.concat(response.data.tracks);
        if (trackIdChunks.length > 0) {
          makeRequest(token, trackIdChunks, allTracks, resolve);
        } else {
          resolve(allTracks);
        }
      })
      .catch(error => {
        console.log('error!', error);
      });
  };

  const chunks = chunk(trackIds, 50);
  makeRequest(token, chunks, [], resolve);
};
