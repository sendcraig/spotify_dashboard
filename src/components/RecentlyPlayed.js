import React, { useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import { orderBy } from 'lodash/collection';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { useCookies } from 'react-cookie';
import TrackTitle from './TrackTitle';
import axios from 'axios';
import * as qs from 'qs';

const RecentlyPlayed = () => {
  const [cookies] = useCookies(['logged_in']);

  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [timeRange, setTimeRange] = useState('2');
  const [trackMap, setTrackMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecentlyPlayed = () => {
    const afterTimestamp = Date.now() - parseInt(timeRange) * 3600000;
    // TODO - use axios, extract to API client file
    setIsLoading(true);

    fetch(
      `https://3nijghj1c7.execute-api.eu-central-1.amazonaws.com/prod/?after_timestamp=${afterTimestamp}`
    )
      .then(res => res.json())
      .then(data => {
        console.log('Successfully called AWS for play history ', data);

        // Get tracks from Spotify API
        const trackIds = data.map(entry => entry.track_id);
        axios
          .get('http://localhost:7000/recently_played', {
            headers: {
              access_token: cookies.access_token,
            },
            params: {
              trackIds: trackIds,
            },
            paramsSerializer: params => {
              return qs.stringify(params, { arrayFormat: 'brackets' });
            },
          })
          .then(response => {
            console.log('successfully got me from Spotify!', response);
            mapRecentlyPlayedTracks(response.data);
          });
        console.log('setting tracks', data);
        const sortedData = orderBy(data, 'played_at', 'desc');
        setRecentlyPlayed(sortedData);
      })
      .catch(err => {
        console.log('Error calling AWS', err);
      });
  };

  const mapRecentlyPlayedTracks = tracks => {
    const recentlyPlayedMap = tracks.reduce((map, obj) => {
      map[obj.id] = obj;
      return map;
    }, {});

    // TODO - cache this or something (don't just store in memory)
    console.log('setting recently played map', recentlyPlayedMap, trackMap);
    setTrackMap({ ...trackMap, ...recentlyPlayedMap });
    setIsLoading(false);
  };

  return (
    <Grid item>
      {/*TODO - change time range to slider or select*/}
      <FormControl>
        <InputLabel htmlFor="time-range">Time range in hours</InputLabel>
        <Input
          id="time-range"
          value={timeRange}
          onChange={event => setTimeRange(event.target.value)}
        />
      </FormControl>

      <Button onClick={fetchRecentlyPlayed}>Get recently played tracks</Button>

      {!isLoading && (
        <Grid container spacing={2}>
          <h4>Recently played:</h4>
          {recentlyPlayed.map(track => (
            <Grid item style={{ width: '100%' }}>
              <p>{new Date(track.played_at).toLocaleString('en-US')}</p>
              <TrackTitle
                title={trackMap[track.track_id].name}
                artist={trackMap[track.track_id].artists[0].name}
                imageUrl={trackMap[track.track_id].album.images[0].url}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Grid>
  );
};

export default RecentlyPlayed;
