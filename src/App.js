import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import './App.css';
import { Button, Container, Grid } from '@material-ui/core';
import { AuthenticationProvider } from './context/Authentication';
import RecentlyPlayed from './components/RecentlyPlayed';
import { getMe } from './spotify/spotifyApi';

const App = () => {
  const [cookies] = useCookies(['logged_in']);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    if (cookies.logged_in) {
      getMe(cookies.access_token, setCurrentUser);
    }
  }, [cookies]);

  return (
    <Container fixed>
      <Grid container spacing={1} justify="center">
        <Grid item xs={12}>
          {!cookies.logged_in ? (
            <>
              <p>User is not logged in!</p>
              <Button href="http://localhost:7000/login">
                Click to log in
              </Button>
            </>
          ) : (
            <>
              <h2>Welcome {currentUser.display_name}!</h2>
              <RecentlyPlayed />
            </>
          )}
        </Grid>
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
