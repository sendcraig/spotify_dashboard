import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import TopList from './TopList';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { countBy, groupBy } from 'lodash/collection';

const RecentlyPlayed = ({ tracks, artistMap }) => {
  const [topArtists, setTopArtists] = useState([]);
  const [topAlbums, setTopAlbums] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const [topGenres, setTopGenres] = useState([]);

  useEffect(() => {
    getTopSongs(tracks);
    getTopArtists(tracks);
    getTopAlbums(tracks);
    getTopGenres(tracks);
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
    const tracksByArtist = groupBy(tracks, track => track.artists[0].id);
    let artists = Object.keys(tracksByArtist).sort((a, b) => {
      return tracksByArtist[b].length - tracksByArtist[a].length;
    });
    artists = artists.map(artist => artistMap[artist]);

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

  const getTopGenres = tracks => {
    const genres = tracks.reduce((a, b) => {
      return a.concat(artistMap[b.artists[0].id].genres);
    }, []);

    let topGenres = countBy(genres);
    topGenres = Object.keys(topGenres).sort((a, b) => {
      return topGenres[b] - topGenres[a];
    });

    // console.log("TOP GENRES", topGenres);
    setTopGenres(topGenres);
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
                imageAccessor={song => song.album.images[2].url}
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
                primaryTextAccessor={artist => artist.name}
                imageAccessor={artist => artist.images[2].url}
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
                imageAccessor={album => album.images[2].url}
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
              <TopList
                data={topGenres}
                primaryTextAccessor={genre => genre}
                limit={10}
              />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

RecentlyPlayed.propTypes = {
  tracks: PropTypes.array.isRequired,
  artistMap: PropTypes.object.isRequired,
};

export default RecentlyPlayed;
