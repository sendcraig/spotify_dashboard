import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

const TrackList = ({ tracks = [], limit }) => {
  const tracksToList = limit ? tracks.slice(0, limit) : tracks;

  return (
    <List style={{ width: '100%', maxHeight: '600px', overflow: 'auto' }}>
      {tracksToList.map(track => (
        <>
          <ListItem>
            <ListItemAvatar>
              <Avatar src={track.album.images[0].url} variant="square" />
            </ListItemAvatar>
            <ListItemText
              primary={track.name}
              secondary={track.artists[0].name}
            />
          </ListItem>
          <Divider />
        </>
      ))}
    </List>
  );
};

TrackList.propTypes = {
  tracks: PropTypes.array.isRequired,
  limit: PropTypes.number,
};

export default TrackList;
