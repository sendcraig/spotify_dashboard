const express = require('express');
const request = require('request');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const querystring = require('querystring');
const array = require('lodash/array');

let stateKey = 'spotify_auth_state';

const server = express();

//accept only JSON
server.use(cookieParser());
server.use(cors());

const CLIENT_ID = '664624fb8bb640fb8b69b4d3e6a18d12';
const CLIENT_SECRET = 'f226fbf8d3f74fb6bb4b8794d77bb88e';
const API_SCOPES = [
  'user-read-private',
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-read-recently-played',
];
const RESPONSE_TYPE = 'code';
const REDIRECT_URI = 'http://localhost:7000/callback';
const HOMEPAGE_REDIRECT = 'http://localhost:1234/';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function(length) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

server.get('/login', function(req, res) {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: RESPONSE_TYPE,
        client_id: CLIENT_ID,
        scope: API_SCOPES,
        redirect_uri: REDIRECT_URI,
        state: state,
      })
  );
});

server.get('/callback', function(req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.cookie('logged_in', false);
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch',
        })
    );
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
      },
      json: true,
    };

    request.post(
      authOptions,
      function(error, response, body) {
        if (!error && response.statusCode === 200) {
          const access_token = body.access_token,
            refresh_token = body.refresh_token;

          // Set cookies with authentication info
          res.cookie('access_token', access_token);
          res.cookie('refresh_token', refresh_token);
          res.cookie('logged_in', true);

          // Redirect to home page if user is logged in
          res.redirect(HOMEPAGE_REDIRECT);
        } else {
          res.cookie('logged_in', false);
          res.redirect(
            '/#' +
              querystring.stringify({
                error: 'invalid_token',
              })
          );
        }
      },
      authOptions
    );
  }
});

// TODO - automate token refreshing (use expiresAt timestamp)
server.get('/refresh_token', function(req, res) {
  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  res.cookie('refresh_token', refresh_token);

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.cookie('access_token', access_token);
      res.cookie('logged_in', true);

      res.send({
        access_token: access_token,
      });
    }
  });
});

// ==========================================
// SPOTIFY API METHODS
// ==========================================

/**
 * Get current user's profile
 * https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
 */
server.get('/me', (req, res) => {
  // TODO - error handling when no access token provided
  const access_token = req.headers.access_token;
  const options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { Authorization: 'Bearer ' + access_token },
    json: true,
  };

  request.get(options, function(error, response, body) {
    res.json(body);
  });
});

/**
 * Get batch of tracks by IDs
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-tracks/
 */
server.get('/tracks', (req, res) => {
  const makeRequest = (token, trackIdChunks, retrievedTracks) => {
    const options = {
      url: `https://api.spotify.com/v1/tracks/?ids=${trackIdChunks
        .shift()
        .join(',')}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      json: true,
    };

    // Make request to Spotify
    request.get(options, function(error, response, body) {
      if (error) {
        console.log('error getting tracks', error);
      }

      const allTracks = retrievedTracks.concat(body.tracks);

      // Recursive loop for pagination
      if (trackIdChunks.length > 0) {
        makeRequest(token, trackIdChunks, allTracks);
      } else {
        res.json(allTracks);
      }
    });
  };

  // Spotify limits batch calls to 50 tracks at a time
  const chunks = array.chunk(req.query.trackIds, 50);
  const access_token = req.headers.access_token;
  makeRequest(access_token, chunks, []);
});

//set port and log to the console
server.listen(7000, () => console.log('server listening'));
