import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import './App.css';
import { Button, Container, Grid } from '@material-ui/core';
import { AuthenticationProvider } from './context/Authentication';
import axios from 'axios';
import RecentlyPlayed from './components/RecentlyPlayed';

const App = () => {
  const [cookies] = useCookies(['logged_in']);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    if (cookies.logged_in) {
      axios
        .get('http://localhost:7000/me', {
          headers: {
            access_token: cookies.access_token,
          },
        })
        .then(response => {
          console.log('successfully got me from Spotify!', response);
          setCurrentUser(response.data);
        });
    }
  }, [cookies]);

  // const getTracksByHour = () => {
  //   const tracksByHour = groupBy(recentlyPlayed, track =>
  //     new Date(track.played_at).getHours()
  //   );
  //
  //   console.log('tracks by hour', tracksByHour);
  //   return Object.keys(tracksByHour).map(hour => {
  //     return {
  //       hour: parseInt(hour),
  //       totalMinutes: tracksByHour[hour].reduce(
  //         (a, b) => (a += trackMap[b.track_id].duration_ms / 60000),
  //         0
  //       ),
  //     };
  //   });
  // };
  //
  // const getTracksByDayByHour = () => {
  //   const tracksByDay = groupBy(recentlyPlayed, track =>
  //     new Date(track.played_at).getDay()
  //   );
  //
  //   console.log('tracks by day', tracksByDay);
  //   const tracksByDayByHour = Object.keys(tracksByDay).map(day => {
  //     return {
  //       day: day,
  //       tracksByHour: groupBy(tracksByDay[day], track =>
  //         new Date(track.played_at).getHours()
  //       ),
  //     };
  //   });
  //
  //   tracksByDayByHour.forEach(dayObj => {
  //     dayObj.tracksByHour = Object.keys(dayObj.tracksByHour).map(hour => {
  //       return {
  //         hour: parseInt(hour),
  //         totalMinutes: dayObj.tracksByHour[hour].reduce(
  //           (a, b) => (a += trackMap[b.track_id].duration_ms / 60000),
  //           0
  //         ),
  //       };
  //     });
  //   });
  //
  //   console.log('tracks by day by hour', tracksByDayByHour);
  //   return tracksByDayByHour;
  // };
  //
  // useEffect(() => {
  //   setGraphData(getTracksByHour());
  //   setStackedGraphData(getTracksByDayByHour());
  // }, [trackMap]);

  return (
    <Container fixed>
      <Grid container spacing={2} justify="center">
        <Grid item xs={12}>
          {!cookies.logged_in ? (
            <>
              <p>User is not logged in!</p>
              <Grid container direction="column" justify="center" spacing={4}>
                <Grid item>
                  <Button href="http://localhost:7000/login">
                    Click to log in
                  </Button>
                </Grid>
              </Grid>
            </>
          ) : (
            Object.keys(currentUser).length > 0 && (
              <h2>Welcome {currentUser.display_name}!</h2>
            )
          )}
        </Grid>
        {/*{token && graphData.length > 0 && (*/}
        {/*  <Grid item xs={12}>*/}
        {/*    <BarGraph*/}
        {/*      data={graphData}*/}
        {/*      xAxis="hour"*/}
        {/*      yAxis="totalMinutes"*/}
        {/*      isStacked={false}*/}
        {/*    />*/}
        {/*  </Grid>*/}
        {/*)}*/}
        {/*{token && stackedGraphData.length > 0 && (*/}
        {/*  <Grid item xs={12}>*/}
        {/*    <BarGraph*/}
        {/*      data={stackedGraphData}*/}
        {/*      xAxis="hour"*/}
        {/*      yAxis="totalMinutes"*/}
        {/*      isStacked={true}*/}
        {/*    />*/}
        {/*  </Grid>*/}
        {/*)}*/}

        {/*<Grid item xs={6}>*/}
        {/*  {token && (*/}
        {/*    <Grid item>*/}
        {/*      <Button onClick={fetchCurrentlyPlaying}>*/}
        {/*        Get currently playing song*/}
        {/*      </Button>*/}

        {/*      {currentlyPlaying && (*/}
        {/*        <Grid>*/}
        {/*          <h4>Now playing:</h4>*/}
        {/*          <TrackTitle*/}
        {/*            title={currentlyPlaying.item.name}*/}
        {/*            artist={currentlyPlaying.item.artists[0].name}*/}
        {/*            imageUrl={currentlyPlaying.item.album.images[0].url}*/}
        {/*          />*/}
        {/*        </Grid>*/}
        {/*      )}*/}
        {/*    </Grid>*/}
        {/*  )}*/}
        {/*</Grid>*/}
        <Grid item xs={6}>
          {cookies.logged_in && <RecentlyPlayed />}
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
