import React, { useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import { groupBy } from 'lodash/collection';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { getTracks } from '../spotify/spotifyApi';
import TrackList from './TrackList';
import Typography from '@material-ui/core/Typography';
import AlbumsList from './AlbumsList';
import ArtistsList from './ArtistsList';
import Select from '@material-ui/core/Select';

const RecentlyPlayed = () => {
  // TODO - move the recently played list & track map to Context
  // const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [trackMap, setTrackMap] = useState({});

  const [topArtists, setTopArtists] = useState([]);
  const [topAlbums, setTopAlbums] = useState([]);
  const [topSongs, setTopSongs] = useState([]);

  const [timeRange, setTimeRange] = useState('5');
  const [timeScale, setTimeScale] = useState('hour');
  const [isLoading, setIsLoading] = useState(false);

  const getTimestampMultiplier = () => {
    switch (timeScale) {
      case 'hour':
        return 3600000;
      case 'day':
        return 3600000 * 24;
      case 'week':
        return 3600000 * 24 * 7;
      case 'month':
        return 3600000 * 24 * 7 * 4;
    }
  };

  const fetchRecentlyPlayed = () => {
    const afterTimestamp =
      Date.now() - parseInt(timeRange) * getTimestampMultiplier();
    // TODO - use axios, extract to API client file
    setIsLoading(true);

    fetch(
      `https://3nijghj1c7.execute-api.eu-central-1.amazonaws.com/prod/?after_timestamp=${afterTimestamp}`
    )
      .then(res => res.json())
      .then(data => {
        console.log('Successfully called AWS for play history ', data);
        const trackIds = data.map(entry => entry.track_id);

        // TODO - move the recently played list to Context
        // setRecentlyPlayed(orderBy(data, 'played_at', 'desc'));

        // Get tracks from Spotify API
        getTracks(trackIds, handleTrackResponse);
      })
      .catch(err => {
        console.log('Error calling AWS', err);
      });
  };

  const handleTrackResponse = tracks => {
    mapRecentlyPlayedTracks(tracks);
    getTopSongs(tracks);
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

  // TODO - DRY these methods up
  const getTopSongs = tracks => {
    const tracksBySong = groupBy(tracks, track => track.id);
    const songs = Object.keys(tracksBySong).sort((a, b) => {
      return tracksBySong[b].length - tracksBySong[a].length;
    });

    setTopSongs(songs);
  };

  const getTopArtists = tracks => {
    const tracksByArtist = groupBy(tracks, track => track.artists[0].name);
    const artists = Object.keys(tracksByArtist).sort((a, b) => {
      return tracksByArtist[b].length - tracksByArtist[a].length;
    });

    setTopArtists(artists);
  };

  const getTopAlbums = tracks => {
    const tracksByAlbum = groupBy(tracks, track => track.album.name);
    let albums = Object.keys(tracksByAlbum).sort((a, b) => {
      return tracksByAlbum[b].length - tracksByAlbum[a].length;
    });
    albums = albums.map(album => {
      return tracksByAlbum[album][0].album;
    });

    setTopAlbums(albums);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControl>
          {/*TODO - change time range to slider or select*/}
          <InputLabel htmlFor="time-range">Time range</InputLabel>
          <Input
            id="time-range"
            value={timeRange}
            onChange={event => setTimeRange(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="time-scale">Time scale</InputLabel>
          <Select
            native
            value={timeScale}
            onChange={event => setTimeScale(event.target.value)}
          >
            <option value="hour">Hours</option>
            <option value="day">Days</option>
            <option value="week">Weeks</option>
            <option value="month">Months</option>
          </Select>
        </FormControl>

        <Button onClick={fetchRecentlyPlayed}>
          Get recently played tracks
        </Button>
      </Grid>

      {!isLoading && (
        <>
          <Grid item xs={3}>
            <Typography variant="h6">Top Tracks</Typography>
            <TrackList
              tracks={topSongs.map(song => {
                return trackMap[song];
              })}
              limit={10}
            />
          </Grid>

          {/*TODO - refactor these List components into a shared one*/}
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
