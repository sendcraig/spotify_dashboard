import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getTracks } from '../spotify/spotifyApi';
import axios from 'axios';
import { orderBy } from 'lodash/collection';

const TrackHistoryContext = createContext({});

const TrackHistoryProvider = props => {
  const [trackHistory, setTrackHistory] = useState([]);
  const [trackMap, setTrackMap] = useState({});

  useEffect(() => {
    axios
      .get(
        'https://3nijghj1c7.execute-api.eu-central-1.amazonaws.com/prod/?after_timestamp=1'
      )
      .then(response => {
        const trackIds = response.data.map(entry => entry.track_id);
        setTrackHistory(orderBy(response.data, 'played_at', 'desc'));

        // Get tracks from Spotify API
        getTracks(trackIds, mapRecentlyPlayedTracks);
      });
  }, []);

  const mapRecentlyPlayedTracks = tracks => {
    const recentlyPlayedMap = tracks.reduce((map, obj) => {
      map[obj.id] = obj;
      return map;
    }, {});

    setTrackMap({ ...trackMap, ...recentlyPlayedMap });
  };

  const getTrackHistory = afterTimestamp => {
    return trackHistory.filter(track => track.played_at > afterTimestamp);
  };

  return (
    <TrackHistoryContext.Provider
      value={{
        trackHistory,
        trackMap,
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
