import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

const TrackList = ({ tracks = [], trackMap }) => {
  return (
    <List style={{ width: '100%', maxHeight: '500px', overflow: 'auto' }}>
      {tracks.map(track => (
        <>
          <ListItem>
            <ListItemAvatar>
              <Avatar src={trackMap[track.track_id].album.images[0].url} />
            </ListItemAvatar>
            <ListItemText
              primary={trackMap[track.track_id].name}
              secondary={trackMap[track.track_id].artists[0].name}
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
  trackMap: PropTypes.object.isRequired,
};

export default TrackList;
