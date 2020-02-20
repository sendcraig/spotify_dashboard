import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Box } from '@material-ui/core';

const TrackTitle = ({ title, artist, imageUrl }) => {
  // TODO - format this with album art on the side
  return (
    <Box style={{ backgroundColor: '#eee' }}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        style={{ padding: '3px' }}
      >
        <Grid item>
          <h4>{title}</h4>
          <p>{artist}</p>
        </Grid>
        <Grid item>
          <img src={imageUrl} style={{ maxWidth: '50px' }} />
        </Grid>
      </Grid>
    </Box>
  );
};

TrackTitle.propTypes = {
  title: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
};

export default TrackTitle;
