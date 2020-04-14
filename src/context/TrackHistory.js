import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getArtists, getTracks } from '../spotify/spotifyApi';
import axios from 'axios';
import { orderBy } from 'lodash/collection';
import { isEmpty } from 'lodash/lang';

const TrackHistoryContext = createContext({});

const TrackHistoryProvider = props => {
  const [trackHistory, setTrackHistory] = useState([]);
  const [trackMap, setTrackMap] = useState({});
  const [artistMap, setArtistMap] = useState({});

  useEffect(() => {
    axios
      .get(
        'https://3nijghj1c7.execute-api.eu-central-1.amazonaws.com/prod/?after_timestamp=1'
      )
      .then(response => {
        const trackIds = response.data.map(entry => entry.track_id);
        setTrackHistory(orderBy(response.data, 'played_at', 'asc'));

        // Get tracks from Spotify API
        getTracks(trackIds, mapRecentlyPlayedTracks);
      });
  }, []);

  useEffect(() => {
    if (!isEmpty(trackMap) && isEmpty(artistMap)) {
      const artistIds = {};
      Object.values(trackMap).forEach(val =>
        artistIds[val.artists[0].id]
          ? artistIds[val.artists[0].id]++
          : (artistIds[val.artists[0].id] = 1)
      );

      console.log('ARTISTS TO FETCH', artistIds);

      // Get artists from Spotify API
      getArtists(Object.keys(artistIds), mapArtists);
    }
  }, [trackMap]);

  const mapRecentlyPlayedTracks = tracks => {
    const recentlyPlayedMap = tracks.reduce((map, obj) => {
      map[obj.id] = obj;
      return map;
    }, {});

    setTrackMap({ ...trackMap, ...recentlyPlayedMap });
  };

  const mapArtists = artists => {
    const spotifyArtistMap = artists.reduce((map, obj) => {
      map[obj.id] = obj;
      return map;
    }, {});

    console.log('ARTIST MAP', spotifyArtistMap);
    setArtistMap({ ...artistMap, ...spotifyArtistMap });
  };

  const getTrackHistory = afterTimestamp => {
    return trackHistory.filter(track => track.played_at > afterTimestamp);
  };

  return (
    <TrackHistoryContext.Provider
      value={{
        trackHistory,
        trackMap,
        artistMap,
        getTrackHistory,
      }}
    >
      {props.children}
    </TrackHistoryContext.Provider>
  );
};

TrackHistoryProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export { TrackHistoryContext, TrackHistoryProvider };
