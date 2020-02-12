import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from '@material-ui/core';

const Login = ({ getAuthUrl }) => {
  return (
    <Grid container direction="column" justify="center" spacing={4}>
      <Grid item>
        <Button href={getAuthUrl()}>Click to log in</Button>
      </Grid>
    </Grid>
  );
};

Login.propTypes = {
  getAuthUrl: PropTypes.func.isRequired,
};

export default Login;
