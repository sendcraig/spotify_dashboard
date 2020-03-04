import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

const AlbumsList = ({ albums = [], limit }) => {
  const albumsToList = limit ? albums.slice(0, limit) : albums;

  return (
    <List style={{ width: '100%', maxHeight: '500px', overflow: 'auto' }}>
      {albumsToList.map(album => (
        <>
          <ListItem>
            <ListItemAvatar>
              <Avatar src={album.images[0].url} variant="square" />
            </ListItemAvatar>
            <ListItemText
              primary={album.name}
              secondary={album.artists[0].name}
            />
          </ListItem>
          <Divider />
        </>
      ))}
    </List>
  );
};

AlbumsList.propTypes = {
  albums: PropTypes.array.isRequired,
  limit: PropTypes.number,
};

export default AlbumsList;
