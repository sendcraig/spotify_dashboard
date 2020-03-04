import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import './App.css';
import { Button, Container, Grid } from '@material-ui/core';
import { AuthenticationProvider } from './context/Authentication';
import RecentlyPlayed from './components/RecentlyPlayed';
import { getMe } from './spotify/spotifyApi';
import Typography from '@material-ui/core/Typography';

const App = () => {
  const [cookies] = useCookies(['logged_in']);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    if (cookies.logged_in) {
      getMe(cookies.access_token, setCurrentUser);
    }
  }, [cookies]);

  return (
    <Container>
      <Grid container spacing={3} justify="center">
        {!cookies.logged_in ? (
          <>
            <Typography variant="p">User is not logged in</Typography>
            <Button href="http://localhost:7000/login">Click to log in</Button>
          </>
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
