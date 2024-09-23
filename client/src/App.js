import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Paper, Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { green } from '@mui/material/colors';
import NotesIcon from '@mui/icons-material/Notes';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import HomeIcon from '@mui/icons-material/Home';
import LogoImage from './images/sportify.png';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',  // This sets the background to black
    primary: {
      main: '#86dc3d', // Buttons and other primary elements
    },
    background: {
      default: '#000', // Page background color (black)
      paper: '#000',   // Match boxes background (black)
    },
    text: {
      primary: '#86dc3d', // Text color
    },
  },
});

function App() {
  const [page, setPage] = useState('soccer');
  const [section, setSection] = useState('main');
  const [premierLeagueGames, setPremierLeagueGames] = useState([]); // State for storing fetched game results
  const [NBAGames, setNBAGames] = useState([]);
  const [laLigaGames, setLaLigaGames] = useState([]);
  const [euroleagueGames, setEuroleagueGames] = useState([]);
  // Premier League
  useEffect(() => {
    fetch('http://localhost:5001/api/premier_league')  // Assuming your backend exposes this API for games
      .then(response => response.json())
      .then(data => {
        setPremierLeagueGames(data);  // Store game data in the state
      })
      .catch(err => console.log(err));
  }, []);

  // La Liga
  useEffect(() => {
    fetch('http://localhost:5001/api/la_liga')  // Assuming your backend exposes this API for games
      .then(response => response.json())
      .then(data => {
        setLaLigaGames(data);  // Store game data in the state
      })
      .catch(err => console.log(err));
  }, []);

  // NBA
  useEffect(() => {
    fetch('http://localhost:5001/api/nba')  // Assuming your backend exposes this API for games
      .then(response => response.json())
      .then(data => {
        setNBAGames(data);  // Store game data in the state
      })
      .catch(err => console.log(err));
  }, []);

  // Euroleague
  useEffect(() => {
    fetch('http://localhost:5001/api/euroleague')  // Assuming your backend exposes this API for games
      .then(response => response.json())
      .then(data => {
        setEuroleagueGames(data);  // Store game data in the state
      })
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
            <Avatar
              sx={{
                bgcolor: game.teams[0] === winner ? green[500] : 'transparent',
                width: 12,
                height: 12,
                ml: 1,
              }}
            />
          </Box>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography>{game.teams[1]}</Typography>
          <Box display="flex" alignItems="center">
            <Typography>{game.scores[1]}</Typography>
            <Avatar
              sx={{
                bgcolor: game.teams[1] === winner ? green[500] : 'transparent',
                width: 12,
                height: 12,
                ml: 1,
              }}
            />
          </Box>
        </Box>
      </Paper>
    );
  };

  const sidebarItems = [
    { text: 'Home', icon: <HomeIcon />, page: 'main' },
    { text: 'Notes', icon: <NotesIcon />, section: 'notes' },
    { text: 'Calories', icon: <RestaurantIcon />, section: 'calories' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              backgroundColor: 'black',
              color: '#86dc3d',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
            <img src={LogoImage} alt="Logo" style={{ width: '100px' }} />
          </Box>
          <List>
            {sidebarItems.map((item, index) => (
              <ListItem button key={index} onClick={() => setSection(item.section)}>
                <ListItemIcon sx={{ color: '#86dc3d' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List sx={{ mt: 'auto' }}>
            <ListItem button>
              <ListItemIcon sx={{ color: '#86dc3d' }}><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button>
              <ListItemIcon sx={{ color: '#86dc3d' }}><InfoIcon /></ListItemIcon>
              <ListItemText primary="About Us" />
            </ListItem>
          </List>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {section === 'main' && (
            <Box>
              {/* Toggle for Soccer and Basketball */}
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

              {/* Soccer/Basketball Matches */}
              {page === 'soccer' && (
                <Box mt={4}>
                  <Typography variant="h4">Premier League</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      '&::-webkit-scrollbar': { display: 'none' },
                    }}
                  >
                    {premierLeagueGames.map((game, index) => renderMatch(game, index))} {/* Render fetched game results */}
                  </Box>
                </Box>
              )}

              {page === 'soccer' && (
                <Box mt={4}>
                  <Typography variant="h4">La Liga</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      '&::-webkit-scrollbar': { display: 'none' },
                    }}
                  >
                    {laLigaGames.map((game, index) => renderMatch(game, index))} {/* Render fetched game results */}
                  </Box>
                </Box>
              )}

              {page === 'basketball' && (
                <Box mt={4}>
                  <Typography variant="h4">NBA</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      '&::-webkit-scrollbar': { display: 'none' },
                    }}
                  >
                    {NBAGames.map((game, index) => renderMatch(game, index))} {/* Render fetched game results */}
                  </Box>
                </Box>
              )}

              {page === 'basketball' && (
                <Box mt={4}>
                  <Typography variant="h4">Euroleague</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      '&::-webkit-scrollbar': { display: 'none' },
                    }}
                  >
                    {euroleagueGames.map((game, index) => renderMatch(game, index))} {/* Render fetched game results */}
                  </Box>
                </Box>
              )}

            </Box>
          )}

          {section === 'notes' && (
            <Box>
              <Typography variant="h4">Notes Section</Typography>
              {/* Add Notes-related content here */}
            </Box>
          )}

          {section === 'calories' && (
            <Box>
              <Typography variant="h4">Calories Tracker</Typography>
              {/* Add Calories-related content here */}
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
