import axios from 'axios';
import * as qs from 'qs';

/**
 * Gets current user's profile from Spotify API.
 * @param token
 * @param callback
 */
export const getMe = (token, callback) => {
  axios
    .get('http://localhost:7000/me', {
      headers: {
        access_token: token,
      },
    })
    .then(response => {
      console.log('successfully got me from Spotify!', response);
      callback(response.data);
    });
};

/**
 * Get batch of tracks from Spotify API.
 * Method is exhaustive and uses pagination to make as many requests as
 * necessary.
 * @param token
 * @param trackIds
 * @param callback
 */
export const getTracks = (token, trackIds, callback) => {
  axios
    .get('http://localhost:7000/tracks', {
      headers: {
        access_token: token,
      },
      params: {
        trackIds: trackIds,
      },
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'brackets' });
      },
    })
    .then(response => {
      console.log('successfully got tracks from Spotify!', response);
      callback(response.data);
    });
};
