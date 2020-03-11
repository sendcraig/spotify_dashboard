const express = require('express');
const request = require('request');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const querystring = require('querystring');
const cache = require('memory-cache');

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
  // your application requests access token
  // after checking the state parameter
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.cookie('logged_in', false);
    res.redirect(
      `${HOMEPAGE_REDIRECT}#` +
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
            expires_in = body.expires_in;

          // Set logged in cookie for frontend
          res.cookie('logged_in', true, {
            expires: new Date(Date.now() + expires_in * 1000),
          });

          cache.put('access_token', access_token, expires_in * 1000);

          // Redirect to home page if user is logged in
          res.redirect(HOMEPAGE_REDIRECT);
        } else {
          res.cookie('logged_in', false);
          res.redirect(
            `${HOMEPAGE_REDIRECT}#` +
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

// ==========================================
// SPOTIFY API METHODS
// ==========================================

/**
 * Get current user's profile
 * https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
 */
server.get('/me', (req, res) => {
  // TODO - error handling when no access token provided
  const access_token = cache.get('access_token');
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
 * Get batch of tracks by IDs. Tracks are cached in memory by ID.
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-tracks/
 */
server.get('/tracks', (req, res) => {
  const trackIds = req.query.trackIds;
  let cachedTracks = [];
  let nonCachedTracks = [];

  // Check if tracks are cached
  trackIds.forEach(trackId => {
    if (cache.get(trackId)) {
      cachedTracks.push(cache.get(trackId));
    } else {
      nonCachedTracks.push(trackId);
    }
  });

  if (nonCachedTracks.length > 0) {
    const access_token = cache.get('access_token');
    const options = {
      url: `https://api.spotify.com/v1/tracks/?ids=${nonCachedTracks}`,
      headers: { Authorization: 'Bearer ' + access_token },
      json: true,
    };

    // Make request to Spotify
    request.get(options, function(error, response, body) {
      if (error) {
        console.log('error getting tracks', error);
      }

      body.tracks.forEach(track => cache.put(track.id, track));
      res.json(body.tracks.concat(cachedTracks));
    });
  } else {
    res.json(cachedTracks);
  }
});

//set port and log to the console
server.listen(7000, () => console.log('server listening'));
