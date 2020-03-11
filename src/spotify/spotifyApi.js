import axios from 'axios';
import { chunk } from 'lodash/array';
import * as qs from 'qs';

/**
 * Gets current user's profile from Spotify API.
 * @param callback
 */
export const getMe = callback => {
  axios.get('http://localhost:7000/me').then(response => {
    console.log('successfully got me from Spotify: ', response);
    callback(response.data);
  });
};

/**
 * Get batch of tracks from Spotify API.
 * Method is exhaustive and uses pagination to make as many requests as
 * necessary.
 * @param trackIds
 * @param callback
 */
export const getTracks = (trackIds, callback) => {
  const makeRequest = (trackIdChunks, retrievedTracks) => {
    axios
      .get('http://localhost:7000/tracks', {
        params: {
          trackIds: trackIdChunks.shift(),
        },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: 'brackets' });
        },
      })
      .then(response => {
        const allTracks = retrievedTracks.concat(response.data);

        // Recursive loop for pagination
        if (trackIdChunks.length > 0) {
          makeRequest(trackIdChunks, allTracks);
        } else {
          console.log('Successfully got tracks from Spotify: ', allTracks);
          callback(allTracks);
        }
      });
  };

  // Spotify limits batch calls to 50 tracks at a time
  const chunks = chunk(trackIds, 50);
  makeRequest(chunks, []);
};
