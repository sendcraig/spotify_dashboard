import React, {useState} from 'react';
import './App.css';
import {Button, Container, Grid} from "@material-ui/core";
import {hash} from "./spotify/authenicate";


const App = () => {
    const [token, setToken] = useState(hash.access_token);

    const getAuthUrl = () => {
        return "https://accounts.spotify.com/authorize?client_id=664624fb8bb640fb8b69b4d3e6a18d12&response_type=token&scope=user-read-private&redirect_uri=http://localhost:3000";
    };

    return (
      <Container fixed>
          <Grid container spacing={2}>
              <Grid item xs={12}>
                  <Grid container direction="column" justify="center" spacing={4}>
                      <Grid item>
                          <p>
                              User is {!token && `not`} logged in.
                          </p>
                      </Grid>
                      <Grid item>
                          <Button href={getAuthUrl()}>Click to log in</Button>
                      </Grid>
                  </Grid>
              </Grid>
          </Grid>
      </Container>
    );
  };

export default App;
