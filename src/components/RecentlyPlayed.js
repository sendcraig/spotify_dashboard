import React, { useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import { orderBy } from 'lodash/collection';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { useCookies } from 'react-cookie';
import { getTracks } from '../spotify/spotifyApi';
import ListeningHistoryGraph from './ListeningHistoryGraph';
import TrackList from './TrackList';

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
        const trackIds = data.map(entry => entry.track_id);
        setRecentlyPlayed(orderBy(data, 'played_at', 'desc'));

        // Get tracks from Spotify API
        getTracks(cookies.access_token, trackIds, mapRecentlyPlayedTracks);
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
    setTrackMap({ ...trackMap, ...recentlyPlayedMap });
    setIsLoading(false);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <FormControl>
          {/*TODO - change time range to slider or select*/}
          <InputLabel htmlFor="time-range">Time range in hours</InputLabel>
          <Input
            id="time-range"
            value={timeRange}
            onChange={event => setTimeRange(event.target.value)}
          />
        </FormControl>

        <Button onClick={fetchRecentlyPlayed}>
          Get recently played tracks
        </Button>
      </Grid>

      {!isLoading && (
        <>
          <Grid item xs={3}>
            <TrackList trackMap={trackMap} tracks={recentlyPlayed} />
          </Grid>
          <Grid item xs={9}>
            <ListeningHistoryGraph
              recentlyPlayed={recentlyPlayed}
              trackMap={trackMap}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default RecentlyPlayed;
