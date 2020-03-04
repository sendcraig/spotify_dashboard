import React, { useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import { groupBy, orderBy } from 'lodash/collection';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { useCookies } from 'react-cookie';
import { getTracks } from '../spotify/spotifyApi';
import TrackList from './TrackList';
import Typography from '@material-ui/core/Typography';
import AlbumsList from './AlbumsList';
import ArtistsList from './ArtistsList';

const RecentlyPlayed = () => {
  const [cookies] = useCookies(['logged_in']);

  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topAlbums, setTopAlbums] = useState([]);
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
        getTracks(cookies.access_token, trackIds, handleTrackResponse);
      })
      .catch(err => {
        console.log('Error calling AWS', err);
      });
  };

  const handleTrackResponse = tracks => {
    mapRecentlyPlayedTracks(tracks);
    getTopArtists(tracks);
    getTopAlbums(tracks);
    setIsLoading(false);
  };

  const mapRecentlyPlayedTracks = tracks => {
    const recentlyPlayedMap = tracks.reduce((map, obj) => {
      map[obj.id] = obj;
      return map;
    }, {});

    // TODO - cache this or something (don't just store in memory)
    setTrackMap({ ...trackMap, ...recentlyPlayedMap });
  };

  const getTopArtists = tracks => {
    const tracksByArtist = groupBy(tracks, track => track.artists[0].name);
    console.log('tracks by artist', tracksByArtist);
    const artists = Object.keys(tracksByArtist).sort((a, b) => {
      return tracksByArtist[b].length - tracksByArtist[a].length;
    });
    console.log('top artists', artists);
    setTopArtists(artists);
  };

  const getTopAlbums = tracks => {
    const tracksByAlbum = groupBy(tracks, track => track.album.name);
    console.log('tracks by album', tracksByAlbum);
    let albums = Object.keys(tracksByAlbum).sort((a, b) => {
      return tracksByAlbum[b].length - tracksByAlbum[a].length;
    });
    albums = albums.map(album => {
      return tracksByAlbum[album][0].album;
    });
    console.log('top albums', albums);
    setTopAlbums(albums);
  };

  return (
    <Grid container spacing={3}>
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
            <Typography variant="h6">
              Recently Played Tracks ({recentlyPlayed.length})
            </Typography>
            <TrackList trackMap={trackMap} tracks={recentlyPlayed} />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6">Top Artists</Typography>
            <ArtistsList artists={topArtists} limit={10} />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6">Top Albums</Typography>
            <AlbumsList albums={topAlbums} limit={10} />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6">Top Genres</Typography>
            <Typography variant="body1">To-do...</Typography>
          </Grid>

          {/*TODO - not sold on Victory... look into other alternatives*/}
          {/*<Grid item xs={9}>*/}
          {/*  <ListeningHistoryGraph*/}
          {/*    recentlyPlayed={recentlyPlayed}*/}
          {/*    trackMap={trackMap}*/}
          {/*  />*/}
          {/*</Grid>*/}
        </>
      )}
    </Grid>
  );
};

export default RecentlyPlayed;
