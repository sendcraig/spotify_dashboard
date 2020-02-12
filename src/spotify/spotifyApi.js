import SpotifyWebApi from 'spotify-web-api-js';

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

export const getRecentlyPlayedTracks = (token, callback, numHours) => {
  spotifyApi.setAccessToken(token);
  const afterCursor = Date.now() - 3600000 * parseInt(numHours);
  console.log('checking after', afterCursor);
  spotifyApi
    .getMyRecentlyPlayedTracks({
      after: afterCursor,
      limit: 50,
    })
    .then(res => {
      // TODO - pagination
      console.log('recently played items', res);
      callback(res.items);
    })
    .catch(err => {
      console.log('error fetching recently played tracks', err);
    });
};
