import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Paper, Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { green } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Global, css } from '@emotion/react';

const vibrateKeyframe = (
  <Global
    styles={css`
      @keyframes vibrate {
        0%, 100% { transform: translate(0, 0); }
        20% { transform: translate(-1px, 1px); }
        40% { transform: translate(1px, -1px); }
        60% { transform: translate(-1px, 1px); }
        80% { transform: translate(1px, -1px); }
      }
    `}
  />
);

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
  const [premierLeagueGamesLive, setPremierLeagueGamesLive] = useState([]);
  const [championsLeagueGamesLive, setChampionsLeagueGamesLive] = useState([]);
  const [bundesligaGames, setBundesligaGames] = useState([]);
  const [NBAGames, setNBAGames] = useState([]);
  const [euroleagueGames, setEuroleagueGames] = useState([]);
  const [euroleagueGamesLive, setEuroleagueGamesLive] = useState([]);

  // for testing
  const [bundesligaGamesLive, setBundesligaGamesLive] = useState({ message: "No teams are playing right now" });
  const [wnbaGamesLive, setWNBAGamesLive] = useState([]);


  useEffect(() => {
    const fetchLiveGames = () => {
      fetch('http://localhost:5001/api/test')
        .then(response => response.json())
        .then(data => setChampionsLeagueGamesLive(data))
        .catch(err => console.log(err));
    };

    fetchLiveGames();

    const intervalId = setInterval(fetchLiveGames, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Fetch Premier League games
  useEffect(() => {
    fetch('http://localhost:5001/api/premier_league')
      .then(response => response.json())
      .then(data => setPremierLeagueGames(data))
      .catch(err => console.log(err));
  }, []);

  // Fetch Premier League games live
  useEffect(() => {
    fetch('http://localhost:5001/api/premier_league_live')
      .then(response => response.json())
      .then(data => setPremierLeagueGamesLive(data))
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

  useEffect(() => {
    const fetchLiveGames = () => {
      fetch('http://localhost:5001/api/euroleague_live')
        .then(response => response.json())
        .then(data => setEuroleagueGamesLive(data))
        .catch(err => console.log(err));
    };

    fetchLiveGames();

    const intervalId = setInterval(fetchLiveGames, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Fetch WNBA League games live
  // useEffect(() => {
  //   fetch('http://localhost:5001/api/wnba')
  //     .then(response => response.json())
  //     .then(data => setWNBAGamesLive(data))
  //     .catch(err => console.log(err));
  // }, []);

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

  const renderLiveMatch = (game, index) => {
    console.log(game)
    const winner = game.scores[0] > game.scores[1] ? game.teams[0] : game.teams[1];
    return (
      <Paper key={index} elevation={3} sx={{ p: 2, m: 1, minWidth: '250px', position: 'relative' }}>
        <Typography variant="h6">Match {index + 1}</Typography>

        {game.status && typeof game.status === 'string' && (game.status.includes('Live') || game.status.includes("Q") || game.status.includes("Halftime")) && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 12,
              height: 12,
              bgcolor: 'red',
              borderRadius: '50%',
              animation: 'vibrate 1s infinite',
            }}
          />
        )}

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography>{game.teams[0]}</Typography>
          <Box display="flex" alignItems="center">
            <Typography>{game.scores[0]}</Typography>
            <Box
              sx={{
                bgcolor: game.teams[0] === winner ? green[500] : 'transparent',
                width: 12,
                height: 12,
                borderRadius: '50%', // Circle
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
                borderRadius: '50%', // Circle
                ml: 1,
              }}
            />
          </Box>
        </Box>
        {(game.minute)&& (
          <Typography
            variant="caption"
            sx={{ position: 'absolute', bottom: 3, right: 8 }}
          >
            {`${game.minute} mins played`}
          </Typography>
        )}
        {(game.status && !game.minute )&& (
          <Typography
            variant="caption"
            sx={{ position: 'absolute', bottom: 2, right: 8 }}
          >
            {`${game.status}`}
          </Typography>
        )}
      </Paper>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      {vibrateKeyframe}
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
          <Box
            sx={{
              background: 'linear-gradient(45deg, #000 30%, #111 90%)',
              color: '#86dc3d',
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '0 0 20px 20px',
              boxShadow: '0 4px 20px rgba(134, 220, 61, 0.15)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                Welcome, Dhruv!
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'normal',
                  opacity: 0.9,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Browse Your Sports Dashboard
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(134,220,61,0.1) 0%, rgba(0,0,0,0) 100%)',
                clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)',
                zIndex: 1,
              }}
            />
          </Box>

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

              {page === 'soccer' && (
                <Box mt={4} sx={{ border: '2px solid #86dc3d', borderRadius: 2, padding: 2 }}>
                  <Typography variant="h4" align="center" sx={{ mb: 2 }}>Premier League</Typography>

                  {/* Recent Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold' }}>Recent matches:</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      backgroundColor: '#fff',
                      '&::-webkit-scrollbar': { display: 'none' },
                      mb: 2
                    }}
                  >
                    {premierLeagueGames.map((game, index) => renderMatch(game, index))}
                  </Box>

                  {/* Live Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold' }}>Live matches:</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      backgroundColor: '#fff',
                      '&::-webkit-scrollbar': { display: 'none' },
                    }}
                  >
                    {/* Check if 'premierLeagueGamesLive' is a message or contains game data */}
                    {premierLeagueGamesLive.message ? (
                      <Typography variant="body1" fontStyle="italic">{premierLeagueGamesLive.message}</Typography>
                    ) : (
                      premierLeagueGamesLive.map((game, index) => renderLiveMatch(game, index))
                    )}
                  </Box>
                </Box>
              )}

              {page === 'soccer' && (
                <Box mt={4} sx={{ border: '2px solid #86dc3d', borderRadius: 2, padding: 2 }}>
                  <Typography variant="h4" align="center" sx={{ mb: 2 }}> Bundesliga</Typography>

                  {/* Recent Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold' }}>Recent matches:</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      backgroundColor: '#fff',
                      '&::-webkit-scrollbar': { display: 'none' },
                      mb: 2
                    }}
                  >
                    {bundesligaGames.map((game, index) => renderMatch(game, index))}
                  </Box>

                  {/* Live Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold' }}>Live matches:</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      backgroundColor: '#fff',
                      '&::-webkit-scrollbar': { display: 'none' },
                    }}
                  >
                    {/* Check if 'premierLeagueGamesLive' is a message or contains game data */}
                    {bundesligaGamesLive.message ? (
                      <Typography variant="body1" fontStyle="italic">{bundesligaGamesLive.message}</Typography>
                    ) : (
                      bundesligaGamesLive.map((game, index) => renderLiveMatch(game, index))
                    )}
                  </Box>
                </Box>
              )}

              {page === 'soccer' && (
                <Box mt={4} sx={{ border: '2px solid #86dc3d', borderRadius: 2, padding: 2 }}>
                  <Typography variant="h4" align="center" sx={{ mb: 2 }}>Champions League</Typography>

                  {/* Live Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold' }}>Live matches:</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      backgroundColor: '#fff',
                      '&::-webkit-scrollbar': { display: 'none' },
                    }}
                  >
                    {/* Check if 'premierLeagueGamesLive' is a message or contains game data */}
                    {championsLeagueGamesLive.message ? (
                      <Typography variant="body1" fontStyle="italic">{championsLeagueGamesLive.message}</Typography>
                    ) : (
                      championsLeagueGamesLive.map((game, index) => renderLiveMatch(game, index))
                    )}
                  </Box>
                </Box>
              )}

              {page === 'basketball' && (
                <Box mt={4} sx={{ border: '2px solid #86dc3d', borderRadius: 2, padding: 2 }}>
                  <Typography variant="h4" align="center" sx={{ mb: 2 }}>NBA</Typography>

                  {/* Recent Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold' }}>Recent matches:</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      backgroundColor: '#fff',
                      '&::-webkit-scrollbar': { display: 'none' },
                      mb: 2
                    }}
                  >
                    {NBAGames.map((game, index) => renderMatch(game, index))}
                  </Box>
                </Box>
              )}

              {page === 'basketball' && (
                <Box mt={4} sx={{ border: '2px solid #86dc3d', borderRadius: 2, padding: 2 }}>
                  <Typography variant="h4" align="center" sx={{ mb: 2 }}>Euroleague</Typography>

                  {/* Recent Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold' }}>Recent matches:</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      backgroundColor: '#fff',
                      '&::-webkit-scrollbar': { display: 'none' },
                      mb: 2
                    }}
                  >
                    {euroleagueGames.map((game, index) => renderMatch(game, index))}
                  </Box>

                  {/* Live Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold' }}>Live matches:</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      backgroundColor: '#fff',
                      '&::-webkit-scrollbar': { display: 'none' },
                    }}
                  >
                    {/* Check if 'euroLeagueGamesLive' is a message or contains game data */}
                    {euroleagueGamesLive.message ? (
                      <Typography variant="body1" fontStyle="italic">{euroleagueGamesLive.message}</Typography>
                    ) : (
                      euroleagueGamesLive.map((game, index) => renderLiveMatch(game, index))
                    )}
                  </Box>
                </Box>
              )}

              {/* WNBA
              {page === 'basketball' && (
                <Box mt={4}>
                  <Typography variant="h4" align="left">WNBA</Typography>
                  <Typography variant="h6" align="left" sx={{ mt: 2 }}>Live matches:</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      '&::-webkit-scrollbar': { display: 'none' },
                    }}
                  >
                    {wnbaGamesLive.map((game, index) => renderLiveMatch(game, index))}
                  </Box>
                </Box>
              )} */}
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Sports;
