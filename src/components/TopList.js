import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

const TopList = ({
  data = [],
  limit,
  imageAccessor,
  primaryTextAccessor,
  secondaryTextAccessor,
}) => {
  const dataToList = limit ? data.slice(0, limit) : data;

  return (
    <List style={{ width: '100%', overflow: 'auto' }}>
      {dataToList.map((entry, index) => (
        <div key={index}>
          <ListItem style={{ height: '75px' }}>
            <ListItemAvatar>
              {imageAccessor ? (
                <Avatar src={imageAccessor(entry)} variant={'square'} />
              ) : (
                <Avatar>{index + 1}</Avatar>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={primaryTextAccessor(entry)}
              secondary={
                secondaryTextAccessor ? secondaryTextAccessor(entry) : ''
              }
            />
          </ListItem>
          {index !== dataToList.length - 1 && <Divider />}
        </div>
      ))}
    </List>
  );
};

TopList.propTypes = {
  data: PropTypes.array.isRequired,
  limit: PropTypes.number,
  imageAccessor: PropTypes.func,
  primaryTextAccessor: PropTypes.func.isRequired,
  secondaryTextAccessor: PropTypes.func,
};

export default TopList;
