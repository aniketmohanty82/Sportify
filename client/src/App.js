import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Paper, Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
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

  // Soccer Matches Data
  const soccerMatches = [
    { team1: 'Team 1', team2: 'Team 2', score1: 2, score2: 3 },
    { team1: 'Team 3', team2: 'Team 4', score1: 1, score2: 1 },
    { team1: 'Team 5', team2: 'Team 6', score1: 0, score2: 2 },
    // Add more soccer matches here
  ];

  // Basketball Matches Data
  const basketballMatches = [
    { team1: 'Team A', team2: 'Team B', score1: 98, score2: 103 },
    { team1: 'Team C', team2: 'Team D', score1: 110, score2: 112 },
    { team1: 'Team E', team2: 'Team F', score1: 95, score2: 90 },
    // Add more basketball matches here
  ];

  const renderMatch = (match, index) => {
    const winner = match.score1 > match.score2 ? match.team1 : match.team2;
    return (
      <Paper key={index} elevation={3} sx={{ p: 2, m: 1, minWidth: '250px' }}>
        <Typography variant="h6">Match {index + 1}</Typography>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography>{match.team1}</Typography>
          <Box display="flex" alignItems="center">
            <Typography>{match.score1}</Typography>
            <Avatar
              sx={{
                bgcolor: match.team1 === winner ? green[500] : 'transparent',
                width: 12,
                height: 12,
                ml: 1,
              }}
            />
          </Box>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography>{match.team2}</Typography>
          <Box display="flex" alignItems="center">
            <Typography>{match.score2}</Typography>
            <Avatar
              sx={{
                bgcolor: match.team2 === winner ? green[500] : 'transparent',
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

  useEffect(() => {
    fetch('http://localhost:5001/')
      .then(response => response.text())
      .then(data => console.log("Backend response:", data))
      .catch(err => console.log(err));
  }, []);

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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
            }}
          >
            {/* Add logo image at the top */}
            <img src={LogoImage} alt="Logo" style={{ width: '100px' }} />
          </Box>
          <List>
            {/* Sidebar Pages */}
            {sidebarItems.map((item, index) => (
              <ListItem button key={index} onClick={() => setSection(item.section)}>
                <ListItemIcon sx={{ color: '#86dc3d' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List sx={{ mt: 'auto' }}>
            {/* Settings and About Us at the bottom */}
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
                  <Typography variant="h4">Soccer Matches</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      '&::-webkit-scrollbar': { display: 'none' },
                    }}
                  >
                    {soccerMatches.map((match, index) => renderMatch(match, index))}
                  </Box>
                </Box>
              )}
              {page === 'basketball' && (
                <Box mt={4}>
                  <Typography variant="h4">Basketball Matches</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      p: 1,
                      '&::-webkit-scrollbar': { display: 'none' },
                    }}
                  >
                    {basketballMatches.map((match, index) => renderMatch(match, index))}
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