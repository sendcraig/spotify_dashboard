import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import TopList from './TopList';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { groupBy } from 'lodash/collection';

const RecentlyPlayed = ({ tracks }) => {
  // console.log('RECENTLY PLAYED TRACKS', tracks);
  const [topArtists, setTopArtists] = useState([]);
  const [topAlbums, setTopAlbums] = useState([]);
  const [topSongs, setTopSongs] = useState([]);

  useEffect(() => {
    getTopSongs(tracks);
    getTopArtists(tracks);
    getTopAlbums(tracks);
  }, [tracks]);

  // TODO - DRY these methods up
  const getTopSongs = tracks => {
    const tracksBySong = groupBy(tracks, track => track.id);
    let songs = Object.keys(tracksBySong).sort((a, b) => {
      return tracksBySong[b].length - tracksBySong[a].length;
    });
    songs = songs.map(song => {
      return tracksBySong[song][0];
    });

    // console.log('top songs', songs);
    setTopSongs(songs);
  };

  const getTopArtists = tracks => {
    const tracksByArtist = groupBy(tracks, track => track.artists[0].name);
    const artists = Object.keys(tracksByArtist).sort((a, b) => {
      return tracksByArtist[b].length - tracksByArtist[a].length;
    });

    // console.log('top artists', artists);
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

    // console.log('top albums', albums);
    setTopAlbums(albums);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container justify="space-evenly" spacing={3}>
          <Grid item xs={3}>
            <Paper>
              <Typography
                variant="h6"
                style={{ textAlign: 'center', paddingTop: '8px' }}
              >
                Top Tracks
              </Typography>
              <TopList
                data={topSongs}
                imageAccessor={song => song.album.images[0].url}
                primaryTextAccessor={song => song.name}
                secondaryTextAccessor={song => song.artists[0].name}
                limit={10}
              />
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <Paper>
              <Typography
                variant="h6"
                style={{ textAlign: 'center', paddingTop: '8px' }}
              >
                Top Artists
              </Typography>
              <TopList
                data={topArtists}
                primaryTextAccessor={artist => artist}
                limit={10}
              />
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper>
              <Typography
                variant="h6"
                style={{ textAlign: 'center', paddingTop: '8px' }}
              >
                Top Albums
              </Typography>
              <TopList
                data={topAlbums}
                imageAccessor={album => album.images[0].url}
                primaryTextAccessor={album => album.name}
                secondaryTextAccessor={album => album.artists[0].name}
                limit={10}
              />
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper>
              <Typography
                variant="h6"
                style={{ textAlign: 'center', paddingTop: '8px' }}
              >
                Top Genres
              </Typography>
              <Typography variant="body1">To-do...</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

RecentlyPlayed.propTypes = {
  tracks: PropTypes.array.isRequired,
};

export default RecentlyPlayed;
