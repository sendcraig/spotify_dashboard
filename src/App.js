import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { Container, Grid } from '@material-ui/core';
import {
  AuthenticationContext,
  AuthenticationProvider,
} from './context/Authentication';
import RecentlyPlayed from './components/RecentlyPlayed';
import { getMe } from './spotify/spotifyApi';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

const App = () => {
  const { isLoggedIn } = useContext(AuthenticationContext);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    if (isLoggedIn) {
      getMe(setCurrentUser);
    }
  }, [isLoggedIn]);

  return (
    <Container>
      <Grid container spacing={3} justify="center">
        {!isLoggedIn ? (
          <Grid item xs={12}>
            <Typography variant="h5">
              Logging in... <CircularProgress />
            </Typography>
          </Grid>
        ) : (
          <>
            <Grid item xs={12}>
              <Typography variant="h3">
                Welcome {currentUser.display_name}!
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <RecentlyPlayed />
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};

const AppConsumer = props => (
  <AuthenticationProvider>
    <App {...props} />
  </AuthenticationProvider>
);

export default AppConsumer;
