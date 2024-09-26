import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Paper, Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { green } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#86dc3d' },
    background: { default: '#000', paper: '#000' },
    text: { primary: '#86dc3d' },
  },
});

function Sports() {
  const [page, setPage] = useState('soccer');
  const [section, setSection] = useState('main');
  const [premierLeagueGames, setPremierLeagueGames] = useState([]);
  const [bundesligaGames, setBundesligaGames] = useState([]);
  const [NBAGames, setNBAGames] = useState([]);
  const [euroleagueGames, setEuroleagueGames] = useState([]);

  // Fetch Premier League games
  useEffect(() => {
    fetch('http://localhost:5001/api/premier_league')
      .then(response => response.json())
      .then(data => setPremierLeagueGames(data))
      .catch(err => console.log(err));
  }, []);

  // Fetch Bundesliga games
  useEffect(() => {
    fetch('http://localhost:5001/api/bundesliga')
      .then(response => response.json())
      .then(data => setBundesligaGames(data))
      .catch(err => console.log(err));
  }, []);

  // Fetch NBA games
  useEffect(() => {
    fetch('http://localhost:5001/api/nba')
      .then(response => response.json())
      .then(data => setNBAGames(data))
      .catch(err => console.log(err));
  }, []);

  // Fetch Euroleague games
  useEffect(() => {
    fetch('http://localhost:5001/api/euroleague')
      .then(response => response.json())
      .then(data => setEuroleagueGames(data))
      .catch(err => console.log(err));
  }, []);

  const renderMatch = (game, index) => {
    const winner = game.scores[0] > game.scores[1] ? game.teams[0] : game.teams[1];
    return (
      <Paper key={index} elevation={3} sx={{ p: 2, m: 1, minWidth: '250px' }}>
        <Typography variant="h6">Match {index + 1}</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography>{game.teams[0]}</Typography>
          <Box display="flex" alignItems="center">
            <Typography>{game.scores[0]}</Typography>
            <Box
              sx={{
                bgcolor: game.teams[0] === winner ? green[500] : 'transparent',
                width: 12,
                height: 12,
                borderRadius: '50%',  // Ensures it's a circle
                ml: 1,
              }}
            />
          </Box>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography>{game.teams[1]}</Typography>
          <Box display="flex" alignItems="center">
            <Typography>{game.scores[1]}</Typography>
            <Box
              sx={{
                bgcolor: game.teams[1] === winner ? green[500] : 'transparent',
                width: 12,
                height: 12,
                borderRadius: '50%',  // Ensures it's a circle
                ml: 1,
              }}
            />
          </Box>
        </Box>
      </Paper>
    );
  };


//NEXT SPRINT
  // const renderLiveMatch = (game, index) => {
  //   return (
  //     <Paper key={index} elevation={3} sx={{ p: 2, m: 1, minWidth: '250px' }}>
  //       <Typography variant="h6">Match {index + 1}</Typography>
  //       <Box display="flex" alignItems="center" justifyContent="space-between">
  //         <Typography>{game.teams[0]}</Typography>
  //         <Box display="flex" alignItems="center">
  //           <Typography>{game.scores[0]}</Typography>
  //         </Box>
  //       </Box>
  //       <Box display="flex" alignItems="center" justifyContent="space-between">
  //         <Typography>{game.teams[1]}</Typography>
  //         <Box display="flex" alignItems="center">
  //           <Typography>{game.scores[1]}</Typography>
  //         </Box>
  //       </Box>
  //     </Paper>
  //   );t
  // };
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            maxWidth: '1200px',
            margin: '0 auto',
            p: 3,
            textAlign: 'center',
          }}
        >
          {/* Centralized Header */}
          <Typography variant="h3" mb={2}>Hello Aniket! Welcome to your Sports Dashboard!</Typography>
          <Typography variant="h6" mb={4}>Keep up with all your favorite sports using the toggle below.</Typography>

          {section === 'main' && (
            <Box>
              <Box display="flex" justifyContent="center" mt={4}>
                <Button
                  variant={page === 'soccer' ? 'contained' : 'outlined'}
                  onClick={() => setPage('soccer')}
                  sx={{ borderRadius: '20px', mx: 1 }}
                >
                  Soccer
                </Button>
                <Button
                  variant={page === 'basketball' ? 'contained' : 'outlined'}
                  onClick={() => setPage('basketball')}
                  sx={{ borderRadius: '20px', mx: 1 }}
                >
                  Basketball
                </Button>
              </Box>

              {/* Premier League */}
              {page === 'soccer' && (
                <Box mt={4}>
                  <Typography variant="h4">Premier League</Typography>
                  <Typography variant="h6" align="left" sx={{ mt: 2 }}>Recent matches:</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      '&::-webkit-scrollbar': { display: 'none' },
                    }}
                  >
                    {premierLeagueGames.map((game, index) => renderMatch(game, index))}
                  </Box>
                </Box>
              )}

              {/* Bundesliga */}
              {page === 'soccer' && (
                <Box mt={4}>
                  <Typography variant="h4">Bundesliga</Typography>
                  <Typography variant="h6" align="left" sx={{ mt: 2 }}>Recent matches:</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      '&::-webkit-scrollbar': { display: 'none' },
                    }}
                  >
                    {bundesligaGames.map((game, index) => renderMatch(game, index))}
                  </Box>
                </Box>
              )}

              {/* NBA */}
              {page === 'basketball' && (
                <Box mt={4}>
                  <Typography variant="h4">NBA</Typography>
                  <Typography variant="h6" align="left" sx={{ mt: 2 }}>Recent matches:</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      '&::-webkit-scrollbar': { display: 'none' },
                    }}
                  >
                    {NBAGames.map((game, index) => renderMatch(game, index))}
                  </Box>
                </Box>
              )}

              {/* Euroleague */}
              {page === 'basketball' && (
                <Box mt={4}>
                  <Typography variant="h4">Euroleague</Typography>
                  <Typography variant="h6" align="left" sx={{ mt: 2 }}>Recent matches:</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      '&::-webkit-scrollbar': { display: 'none' },
                    }}
                  >
                    {euroleagueGames.map((game, index) => renderMatch(game, index))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Sports;
