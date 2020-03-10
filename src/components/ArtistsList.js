import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

const ArtistsList = ({ artists = [], limit }) => {
  const albumsToList = limit ? artists.slice(0, limit) : artists;

  return (
    <List style={{ width: '100%', maxHeight: '600px', overflow: 'auto' }}>
      {albumsToList.map((artist, index) => (
        <>
          <ListItem>
            <ListItemAvatar>
              <Avatar>{index + 1}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={artist} />
          </ListItem>
          <Divider />
        </>
      ))}
    </List>
  );
};

ArtistsList.propTypes = {
  artists: PropTypes.array.isRequired,
  limit: PropTypes.number,
};

export default ArtistsList;
