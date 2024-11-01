import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Paper, Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Modal, IconButton, LinearProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SquareIcon from '@mui/icons-material/Square';
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
    primary: { main: '#1aa64b' },
    background: { default: '#000', paper: '#f9f9f9' },
    text: { primary: '#000000' },
  },
});

// Basketball Fixtures
const BasketballFixturesModal = ({ open, handleClose, fixtures }) => {
  if (!fixtures) return null;

  // Group fixtures by date
  const groupedFixtures = fixtures.reduce((groups, fixture) => {
    const date = new Date(fixture.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(fixture);
    return groups;
  }, {});

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="fixtures-modal"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 1200,
        maxHeight: '80vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.primary'
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{
          overflowY: 'auto',
          flex: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}>
          {/* Column Headers */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: '3fr 1fr 1fr 2fr',
            gap: 2,
            mb: 2,
            px: 2,
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            pb: 1
          }}>
            <Typography fontWeight="bold">MATCH</Typography>
            <Typography fontWeight="bold">DATE</Typography>
            <Typography fontWeight="bold">TIME</Typography>
            <Typography fontWeight="bold">LOCATION</Typography>
          </Box>

          {Object.entries(groupedFixtures).map(([date, dateFixtures]) => (
            <Box key={date}>
              <Typography variant="h6" sx={{ px: 2, py: 1, bgcolor: 'rgba(0, 0, 0, 0.04)' }}>
                {date}
              </Typography>

              {dateFixtures.map((fixture) => (
                <Box key={fixture.fixture_id} sx={{
                  display: 'grid',
                  gridTemplateColumns: '3fr 1fr 1fr 2fr',
                  gap: 2,
                  px: 2,
                  py: 1.5,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.02)'
                  }
                }}>
                  {/* Match */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                      <img src={fixture.teams.home.logo} alt="" style={{ width: 24, height: 24 }} />
                      <Typography>{fixture.teams.home.name}</Typography>
                    </Box>
                    <Typography sx={{ mx: 1 }}>v</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                      <img src={fixture.teams.away.logo} alt="" style={{ width: 24, height: 24 }} />
                      <Typography>{fixture.teams.away.name}</Typography>
                    </Box>
                  </Box>

                  {/* Date */}
                  <Typography>
                    {new Date(fixture.date).toLocaleDateString()}
                  </Typography>

                  {/* Time */}
                  <Typography>
                    {new Date(fixture.date).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      timeZone: 'America/New_York'
                    })}
                  </Typography>

                  {/* Location */}
                  <Typography>
                    {fixture.venue}
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Modal>
  );
};
// Soccer Fixtures
const FixturesModal = ({ open, handleClose, fixtures }) => {
  // Group fixtures by date
  const groupedFixtures = fixtures?.reduce((groups, fixture) => {
    const date = new Date(fixture.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(fixture);
    return groups;
  }, {});

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="fixtures-modal"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 1000,
        maxHeight: '80vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.primary'
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Scrollable Content */}
        <Box sx={{
          overflowY: 'auto',
          flex: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}>
          {/* Column Headers */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: '3fr 1fr 1fr 2fr',
            gap: 2,
            mb: 2,
            px: 2,
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            pb: 1
          }}>
            <Typography fontWeight="bold">MATCH</Typography>
            <Typography fontWeight="bold">DATE</Typography>
            <Typography fontWeight="bold">TIME</Typography>
            <Typography fontWeight="bold">LOCATION</Typography>
          </Box>

          {/* Fixtures by Date */}
          {groupedFixtures && Object.entries(groupedFixtures).map(([date, dateFixtures]) => (
            <Box key={date}>
              <Typography variant="h6" sx={{ px: 2, py: 1, bgcolor: 'rgba(0, 0, 0, 0.04)' }}>
                {date}
              </Typography>

              {dateFixtures.map((fixture) => (
                <Box key={fixture.fixture_id} sx={{
                  display: 'grid',
                  gridTemplateColumns: '3fr 1fr 1fr 2fr',
                  gap: 2,
                  px: 2,
                  py: 1.5,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.02)'
                  }
                }}>
                  {/* Match */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                      <img src={fixture.teams.home.logo} alt="" style={{ width: 24, height: 24 }} />
                      <Typography>{fixture.teams.home.name}</Typography>
                    </Box>
                    <Typography sx={{ mx: 1 }}>v</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                      <img src={fixture.teams.away.logo} alt="" style={{ width: 24, height: 24 }} />
                      <Typography>{fixture.teams.away.name}</Typography>
                    </Box>
                  </Box>

                  {/* Date */}
                  <Typography>
                    {new Date(fixture.date).toLocaleDateString()}
                  </Typography>

                  {/* Time */}
                  <Typography>
                    {new Date(fixture.date).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      timeZone: 'America/New_York'
                    })}
                  </Typography>

                  {/* Location */}
                  <Typography>
                    {`${fixture.venue.name}, ${fixture.venue.city}`}
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Modal>
  );
};

const BasketballMatchDetailsModal = ({ open, handleClose, matchData }) => {
  console.log("Basketball Modal Data:", matchData);

  if (!matchData) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="match-details-modal"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 600,
        maxHeight: '80vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.primary'
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* League Info - Add this section */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 3,
          pb: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img
              src={matchData.league.logo}
              alt="League logo"
              style={{ width: 32, height: 64 }}
            />
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              {matchData.league.name}
            </Typography>
          </Box>
        </Box>

        {/* Match Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          pb: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
        }}>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <img src={matchData.teams.home.logo} alt="Home team" style={{ width: 48, height: 48 }} />
            <Typography variant="subtitle1">{matchData.teams.home.name}</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', mx: 2 }}>
            <Typography variant="h3">{matchData.scores.home.total} - {matchData.scores.away.total}</Typography>
            {(matchData.status.short.includes('Q') || matchData.status.long.includes('Half')) && (
              <Typography sx={{
                color: 'error.main',
                fontWeight: 'bold',
              }}>
                {`${matchData.status.long}${matchData.status.timer ? ` - ${matchData.status.timer}:00` : ''}`}
              </Typography>
            )}
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <img src={matchData.teams.away.logo} alt="Away team" style={{ width: 48, height: 48 }} />
            <Typography variant="subtitle1">{matchData.teams.away.name}</Typography>
          </Box>
        </Box>

        {/* Quarter Scores */}
        <Box sx={{ px: 3, mb: 4 }}>
          {['quarter_1', 'quarter_2', 'quarter_3', 'quarter_4'].map((quarter, index) => (
            <Box key={quarter} sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
              py: 1,
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
              bgcolor: matchData.status.short === `Q${index + 1}` ? 'rgba(255, 0, 0, 0.1)' : 'transparent'
            }}>
              <Typography sx={{ flex: 1, textAlign: 'right', color: 'text.primary' }}>
                {matchData.scores.home[quarter]}
              </Typography>
              <Typography sx={{
                flex: 2,
                textAlign: 'center',
                fontWeight: 'bold',
                color: matchData.status.short === `Q${index + 1}` ? 'error.main' : 'text.primary',
                px: 2
              }}>
                {`Q${index + 1}`}
              </Typography>
              <Typography sx={{ flex: 1, textAlign: 'left', color: 'text.primary' }}>
                {matchData.scores.away[quarter]}
              </Typography>
            </Box>
          ))}

          {/* Overtime if exists */}
          {matchData.scores.home.over_time && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
              py: 1,
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
            }}>
              <Typography sx={{ flex: 1, textAlign: 'right', color: 'text.primary' }}>
                {matchData.scores.home.over_time}
              </Typography>
              <Typography sx={{
                flex: 2,
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'warning.main',
                px: 2
              }}>
                OT
              </Typography>
              <Typography sx={{ flex: 1, textAlign: 'left', color: 'text.primary' }}>
                {matchData.scores.away.over_time}
              </Typography>
            </Box>
          )}

          {/* Total Score with different styling */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
            pt: 1,
            borderTop: '2px solid rgba(0, 0, 0, 0.12)'
          }}>
            <Typography sx={{ flex: 1, textAlign: 'right', fontWeight: 'bold', color: 'text.primary' }}>
              {matchData.scores.home.total}
            </Typography>
            <Typography sx={{
              flex: 2,
              textAlign: 'center',
              fontWeight: 'bold',
              color: 'text.primary',
              px: 2
            }}>
              FINAL
            </Typography>
            <Typography sx={{ flex: 1, textAlign: 'left', fontWeight: 'bold', color: 'text.primary' }}>
              {matchData.scores.away.total}
            </Typography>
          </Box>

          {/* Game Info */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              {`Venue: ${matchData.venue}`}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {`Date: ${new Date(matchData.date).toLocaleDateString()}`}
            </Typography>
            <Typography variant="body2" sx={{
              color: matchData.status.long.includes('Over Time') ? 'warning.main' : 'text.secondary',
              mt: 1,
              fontWeight: 'bold'
            }}>
              {matchData.status.long}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

const MatchDetailsModal = ({ open, handleClose, matchData }) => {
  if (!matchData) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="match-details-modal"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 600,
        maxHeight: '80vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.primary'
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Match Header - Fixed */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          pb: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
        }}>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <img src={matchData.teams.home.logo} alt="Home team" style={{ width: 48, height: 48 }} />
            <Typography variant="subtitle1">{matchData.teams.home.name}</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', mx: 2 }}>
            <Typography variant="h3">{matchData.goals.home} - {matchData.goals.away}</Typography>
            {(matchData.fixture.status.short === "1H" ||
              matchData.fixture.status.short === "2H" ||
              matchData.fixture.status.short === "HT") && (
                <Typography sx={{
                  color: 'error.main',
                  fontWeight: 'bold'
                }}>
                  {`${matchData.fixture.status.elapsed}'`}
                </Typography>
              )}
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <img src={matchData.teams.away.logo} alt="Away team" style={{ width: 48, height: 48 }} />
            <Typography variant="subtitle1">{matchData.teams.away.name}</Typography>
          </Box>
        </Box>

        {/* Scrollable Content */}
        <Box sx={{
          overflowY: 'auto',
          flex: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}>
          {/* Goals Section */}
          <Box sx={{ mb: 3, px: 2 }}>
            {matchData.events
              .filter(event => event.type === "Goal")
              .map((goal, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: goal.team.id === matchData.teams.home.id ? 'flex-start' : 'flex-end',
                    mb: 1
                  }}
                >
                  <SportsSoccerIcon sx={{ mr: 1, color: 'text.primary' }} />
                  <Typography sx={{ color: 'text.primary' }}>
                    {`${goal.player.name} ${goal.time.elapsed}'`}
                  </Typography>
                </Box>
              ))}
          </Box>

          {/* Cards Section */}
          <Box sx={{ mb: 3, px: 2 }}>
            {matchData.events
              .filter(event => event.type === "Card")
              .map((card, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: card.team.id === matchData.teams.home.id ? 'flex-start' : 'flex-end',
                    mb: 1
                  }}
                >
                  <SquareIcon
                    sx={{
                      mr: 1,
                      color: card.detail === 'Yellow Card' ? '#ffd700' : '#ff0000'
                    }}
                  />
                  <Typography sx={{ color: 'text.primary' }}>
                    {`${card.player.name} ${card.time.elapsed}'`}
                  </Typography>
                </Box>
              ))}
          </Box>

          {/* Possession Bar */}
          {matchData.statistics[0].statistics.find(stat => stat.type === 'Ball Possession') && (
            <Box sx={{ mb: 3, px: 2 }}>
              <Box sx={{ width: '100%', mb: 2 }}>
                {(() => {
                  const possessionStat = matchData.statistics[0].statistics.find(stat => stat.type === 'Ball Possession');
                  const homePossession = parseInt(possessionStat.value.replace('%', ''));
                  const awayPossession = 100 - homePossession;
                  return (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography color="text.primary">{`${homePossession}%`}</Typography>
                        <Typography sx={{ fontWeight: 'bold', color: 'text.primary' }}>Possession</Typography>
                        <Typography color="text.primary">{`${awayPossession}%`}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={homePossession}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: '#ff0000',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#1aa64b',
                            borderRadius: 5,
                          }
                        }}
                      />
                    </>
                  );
                })()}
              </Box>
            </Box>
          )}

          {/* Match Stats */}
          <Typography variant="h6" sx={{ textAlign: 'center', mb: 2, color: 'text.primary' }}>
            TEAM STATS
          </Typography>
          <Box sx={{ px: 3 }}>
            {matchData.statistics[0].statistics.map((stat, index) => {
              const awayStat = matchData.statistics[1].statistics[index];

              // Format the stat value based on its type
              const formatStatValue = (value, type) => {
                if (!value) return '0';
                switch (type) {
                  case 'Ball Possession':
                  case 'Pass Accuracy':
                    return value.includes('%') ? value : `${value}%`;
                  case 'expected_goals':
                  case 'goals_prevented':
                    return Number(value).toFixed(2);
                  default:
                    return parseInt(value) || '0';
                }
              };

              // Format the stat type
              const formatStatType = (type) => {
                switch (type) {
                  case 'Total Shots':
                    return 'Shots';
                  case 'Shots on Goal':
                    return 'Shots on target';
                  case 'Ball Possession':
                    return 'Possession';
                  case 'Total passes':
                    return 'Passes';
                  case 'Passes accurate':
                    return 'Passes accurate';
                  case 'expected_goals':
                    return 'Expected Goals';
                  case 'goals_prevented':
                    return 'Goals Prevented';
                  default:
                    return type;
                }
              };

              return (
                <Box key={index} sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                  py: 1,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
                }}>
                  <Typography sx={{ flex: 1, textAlign: 'right', color: 'text.primary' }}>
                    {formatStatValue(stat.value, stat.type)}
                  </Typography>
                  <Typography sx={{
                    flex: 2,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: 'text.primary',
                    px: 2
                  }}>
                    {formatStatType(stat.type)}
                  </Typography>
                  <Typography sx={{ flex: 1, textAlign: 'left', color: 'text.primary' }}>
                    {formatStatValue(awayStat.value, awayStat.type)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

function Sports() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMatchDetails, setSelectedMatchDetails] = useState(null);
  const [page, setPage] = useState('soccer');
  const [section, setSection] = useState('main');
  const [premierLeagueGames, setPremierLeagueGames] = useState([]);
  const [premierLeagueGamesLive, setPremierLeagueGamesLive] = useState([]);
  const [championsLeagueGames, setChampionsLeagueGames] = useState([]);
  const [championsLeagueGamesLive, setChampionsLeagueGamesLive] = useState([]);
  const [bundesligaGames, setBundesligaGames] = useState([]);
  const [NBAGames, setNBAGames] = useState([]);
  const [NBAGamesLive, setNBAGamesLive] = useState([]);
  const [euroleagueGames, setEuroleagueGames] = useState([]);
  const [euroleagueGamesLive, setEuroleagueGamesLive] = useState([]);
  const [serieAGamesLive, setserieAleagueGamesLive] = useState([]);
  const [bundesligaGamesLive, setBundesligaGamesLive] = useState([]);
  const [fixturesModalOpen, setFixturesModalOpen] = useState(false);
  const [fixturesData, setFixturesData] = useState(null);
  const [basketballFixturesModalOpen, setBasketballFixturesModalOpen] = useState(false);
  const [basketballFixturesData, setBasketballFixturesData] = useState(null);

  //test
  const [wnbaGamesLive, setWNBAGamesLive] = useState([]);

  // Soccer fixtures list
  const handleFixturesClick = async (leagueId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/fixtures/${leagueId}`);
      const data = await response.json();
      setFixturesData(data);
      setFixturesModalOpen(true);
    } catch (error) {
      console.error('Error fetching fixtures:', error);
    }
  };

  // Basketball fixtures list
  const handleBasketballFixturesClick = async (leagueId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/basketball_fixtures/${leagueId}`);
      const data = await response.json();
      console.log("Basketball Fixtures Data:", data);  // For debugging
      setBasketballFixturesData(data);
      setBasketballFixturesModalOpen(true);
    } catch (error) {
      console.error('Error fetching basketball fixtures:', error);
    }
  };

  // UCL live
  useEffect(() => {
    const fetchLiveGames = () => {
      fetch('http://localhost:5001/api/ucl_live')
        .then(response => response.json())
        .then(data => setChampionsLeagueGamesLive(data))
        .catch(err => console.log(err));
    };

    fetchLiveGames();

    const intervalId = setInterval(fetchLiveGames, 120000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchLiveGames = () => {
      fetch('http://localhost:5001/api/test_live')
        .then(response => response.json())
        .then(data => setserieAleagueGamesLive(data))
        .catch(err => console.log(err));
    };

    fetchLiveGames();

    const intervalId = setInterval(fetchLiveGames, 120000);

    return () => clearInterval(intervalId);
  }, []);

  // Fetch UCL games
  useEffect(() => {
    fetch('http://localhost:5001/api/ucl')
      .then(response => response.json())
      .then(data => setChampionsLeagueGames(data))
      .catch(err => console.log(err));
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

  //Bundesliga Live
  useEffect(() => {
    const fetchLiveGames = () => {
      fetch('http://localhost:5001/api/bundesliga_live')
        .then(response => response.json())
        .then(data => setBundesligaGamesLive(data))
        .catch(err => console.log(err));
    };

    fetchLiveGames();

    const intervalId = setInterval(fetchLiveGames, 120000);

    return () => clearInterval(intervalId);
  }, []);

  // Fetch NBA games
  useEffect(() => {
    fetch('http://localhost:5001/api/nba')
      .then(response => response.json())
      .then(data => setNBAGames(data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const fetchLiveGames = () => {
      fetch('http://localhost:5001/api/nba_live')
        .then(response => response.json())
        .then(data => setNBAGamesLive(data))
        .catch(err => console.log(err));
    };

    fetchLiveGames();

    const intervalId = setInterval(fetchLiveGames, 120000);

    return () => clearInterval(intervalId);
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

    const intervalId = setInterval(fetchLiveGames, 120000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setModalOpen(false);
    setSelectedMatchDetails(null);
  }, [page]);

  const username = localStorage.getItem('username') || 'Guest';


  const handleMatchClick = async (game, sport) => {
    try {
      console.log("Clicked game:", game);
      console.log("Sport:", sport);

      let response;
      if (sport === 'soccer') {
        response = await fetch(`http://localhost:5001/api/fixture_details/${game.fixture_id}`);
      } else if (sport === 'basketball') {
        response = await fetch(`http://localhost:5001/api/basketball_fixture_details/${game.fixture_id}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.response && data.response.length > 0) {
        setSelectedMatchDetails(data.response[0]);
        setModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching match details:', error);
    }
  };
  const renderMatch = (game, index, sport) => {

    // Handle case where scores might be null (upcoming games)
    const homeScore = game.scores[0] ?? 0;
    const awayScore = game.scores[1] ?? 0;
    const winner = homeScore > awayScore ? game.teams[0] :
      awayScore > homeScore ? game.teams[1] : null;

    return (
      <Paper elevation={3} onClick={() => handleMatchClick(game, sport)} sx={{
        p: 2,
        m: 1,
        minWidth: '250px',
        position: 'relative',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.02)',
          transition: 'transform 0.2s ease-in-out',
          boxShadow: 6,
        },
      }} >
        <Typography variant="h6">Match {index + 1}</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
          <Typography
            sx={{
              textAlign: 'left',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1
            }}
          >
            {game.teams[0]}
          </Typography>
          <Box display="flex" alignItems="center" sx={{ flexShrink: 0 }}>
            <Typography>{homeScore}</Typography>
            <Box
              sx={{
                bgcolor: game.teams[0] === winner ? green[500] : 'transparent',
                width: 12,
                height: 12,
                borderRadius: '50%',
                ml: 1,
              }}
            />
          </Box>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
          <Typography
            sx={{
              textAlign: 'left',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1
            }}
          >
            {game.teams[1]}
          </Typography>
          <Box display="flex" alignItems="center" sx={{ flexShrink: 0 }}>
            <Typography>{awayScore}</Typography>
            <Box
              sx={{
                bgcolor: game.teams[1] === winner ? green[500] : 'transparent',
                width: 12,
                height: 12,
                borderRadius: '50%',
                ml: 1,
              }}
            />
          </Box>
        </Box>
        {game.status && (
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              bottom: 3,
              right: 8,
              color: game.status.includes('Over Time') ? 'warning.main' : 'text.secondary'
            }}
          >
            {game.status}
          </Typography>
        )}
      </Paper>
    );
  };

  const renderLiveMatch = (game, index, sport) => {
    const homeScore = game.scores[0] ?? 0;
    const awayScore = game.scores[1] ?? 0;
    const winner = homeScore > awayScore ? game.teams[0] :
      awayScore > homeScore ? game.teams[1] : null;

    return (
      <Paper elevation={3} onClick={() => handleMatchClick(game, sport)} sx={{
        p: 2,
        m: 1,
        minWidth: '250px',
        position: 'relative',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.02)',
          transition: 'transform 0.2s ease-in-out',
          boxShadow: 6,
        },
      }} >
        <Typography variant="h6">Match {index + 1}</Typography>

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

        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
          <Typography
            sx={{
              textAlign: 'left',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1
            }}
          >
            {game.teams[0]}
          </Typography>
          <Box display="flex" alignItems="center" sx={{ flexShrink: 0 }}>
            <Typography>{homeScore}</Typography>
            <Box
              sx={{
                bgcolor: game.teams[0] === winner ? green[500] : 'transparent',
                width: 12,
                height: 12,
                borderRadius: '50%',
                ml: 1,
              }}
            />
          </Box>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
          <Typography
            sx={{
              textAlign: 'left',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1
            }}
          >
            {game.teams[1]}
          </Typography>
          <Box display="flex" alignItems="center" sx={{ flexShrink: 0 }}>
            <Typography>{awayScore}</Typography>
            <Box
              sx={{
                bgcolor: game.teams[1] === winner ? green[500] : 'transparent',
                width: 12,
                height: 12,
                borderRadius: '50%',
                ml: 1,
              }}
            />
          </Box>
        </Box>

        {game.in_game_time && (
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              bottom: 3,
              right: 8,
              color: 'error.main'
            }}
          >
            {game.in_game_time}
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
              backgroundColor: '#f9f9f9',
              color: '#1aa64b',
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
                  fontFamily: 'Open Sans, sans-serif',
                  marginBottom: '0.5rem',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                Welcome!
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'normal',
                  fontFamily: 'Open Sans, sans-serif',
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
                background: 'linear-gradient(135deg, rgba(134,220,61,0.1) 0%, rgba(249,249,249,0) 100%)',
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
                <Box mt={4} sx={{ boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)', borderRadius: 2, padding: 2 }}>
                  {/* Add container for title and button */}
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Typography variant="h4" align="center">Premier League</Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleFixturesClick(39)}  // 39 is Premier League ID
                      sx={{
                        backgroundColor: '#1aa64b',
                        '&:hover': {
                          backgroundColor: '#158f3f'
                        }
                      }}
                    >
                      Fixtures
                    </Button>
                  </Box>

                  {/* Recent Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold', fontFamily: 'Open Sans, sans-serif' }}>Recent matches:</Typography>
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
                    {premierLeagueGames.map((game, index) => (
                      <div key={index}>
                        {renderMatch(game, index, 'soccer')}
                      </div>
                    ))}
                  </Box>

                  {/* Live Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold', fontFamily: 'Open Sans, sans-serif' }}>Live matches:</Typography>
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
                      <Typography variant="body1" fontStyle="italic" fontFamily='Open Sans, sans-serif'>{premierLeagueGamesLive.message}</Typography>
                    ) : (
                      premierLeagueGamesLive.map((game, index) => renderLiveMatch(game, index, 'soccer'))
                    )}
                  </Box>
                </Box>
              )}

              {page === 'soccer' && (
                <Box mt={4} sx={{ boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)', borderRadius: 2, padding: 2 }}>
                  {/* Add container for title and button */}
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Typography variant="h4" align="center">Bundesliga</Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleFixturesClick(78)}
                      sx={{
                        backgroundColor: '#1aa64b',
                        '&:hover': {
                          backgroundColor: '#158f3f'
                        }
                      }}
                    >
                      Fixtures
                    </Button>
                  </Box>

                  {/* Recent Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold', fontFamily: 'Open Sans, sans-serif' }}>Recent matches:</Typography>
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
                    {bundesligaGames.map((game, index) => (
                      <div key={index}>
                        {renderMatch(game, index, 'soccer')}
                      </div>
                    ))}
                  </Box>

                  {/* Live Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold', fontFamily: 'Open Sans, sans-serif' }}>Live matches:</Typography>
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
                      <Typography variant="body1" fontStyle="italic" fontFamily='Open Sans, sans-serif'>{bundesligaGamesLive.message}</Typography>
                    ) : (
                      bundesligaGamesLive.map((game, index) => renderLiveMatch(game, index, 'soccer'))
                    )}
                  </Box>
                </Box>
              )}

              {page === 'soccer' && (
                <Box mt={4} sx={{ boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)', borderRadius: 2, padding: 2 }}>
                  {/* Add container for title and button */}
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Typography variant="h4" align="center">Champions League</Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleFixturesClick(2)}
                      sx={{
                        backgroundColor: '#1aa64b',
                        '&:hover': {
                          backgroundColor: '#158f3f'
                        }
                      }}
                    >
                      Fixtures
                    </Button>
                  </Box>

                  {/* Recent Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold', fontFamily: 'Open Sans, sans-serif' }}>Recent matches:</Typography>
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
                    {championsLeagueGames.map((game, index) => (
                      <div key={index}>
                        {renderMatch(game, index, 'soccer')}
                      </div>
                    ))}
                  </Box>

                  {/* Live Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold', fontFamily: 'Open Sans, sans-serif' }}>Live matches:</Typography>
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
                      <Typography variant="body1" fontStyle="italic" fontFamily='Open Sans, sans-serif'>{championsLeagueGamesLive.message}</Typography>
                    ) : (
                      championsLeagueGamesLive.map((game, index) => renderLiveMatch(game, index, 'soccer'))
                    )}
                  </Box>
                </Box>
              )}


              {page === 'soccer' && (
                <Box mt={4} sx={{ boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)', borderRadius: 2, padding: 2 }}>
                  <Typography variant="h4" align="center" sx={{ mb: 2 }}>Serie A</Typography>

                  {/* Live Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold', fontFamily: 'Open Sans, sans-serif' }}>Live matches:</Typography>
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
                    {serieAGamesLive.message ? (
                      <Typography variant="body1" fontStyle="italic" fontFamily='Open Sans, sans-serif'>{serieAGamesLive.message}</Typography>
                    ) : (
                      serieAGamesLive.map((game, index) => renderLiveMatch(game, index, 'soccer'))
                    )}
                  </Box>
                </Box>
              )}

              {page === 'basketball' && (
                <Box mt={4} sx={{ boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)', borderRadius: 2, padding: 2 }}>
                  {/* Add container for title and button */}
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Typography variant="h4" align="center">NBA</Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleBasketballFixturesClick(12)}  // 12 is NBA ID
                      sx={{
                        backgroundColor: '#1aa64b',
                        '&:hover': {
                          backgroundColor: '#158f3f'
                        }
                      }}
                    >
                      Fixtures
                    </Button>
                  </Box>

                  {/* Recent Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold', fontFamily: 'Open Sans, sans-serif' }}>Recent matches:</Typography>
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
                    {NBAGames.map((game, index) => renderMatch(game, index, 'basketball'))}
                  </Box>

                  {/* Live Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold', fontFamily: 'Open Sans, sans-serif' }}>Live matches:</Typography>
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
                    {/* Check if 'NBAGamesLive' is a message or contains game data */}
                    {NBAGamesLive.message ? (
                      <Typography variant="body1" fontStyle="italic" fontFamily='Open Sans, sans-serif'>{NBAGamesLive.message}</Typography>
                    ) : (
                      NBAGamesLive.map((game, index) => renderLiveMatch(game, index, 'basketball'))
                    )}
                  </Box>
                </Box>
              )}

              {page === 'basketball' && (
                <Box mt={4} sx={{ boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)', borderRadius: 2, padding: 2 }}>
                  {/* Add container for title and button */}
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Typography variant="h4" align="center">Euroleague</Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleBasketballFixturesClick(120)}
                      sx={{
                        backgroundColor: '#1aa64b',
                        '&:hover': {
                          backgroundColor: '#158f3f'
                        }
                      }}
                    >
                      Fixtures
                    </Button>
                  </Box>

                  {/* Recent Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold', fontFamily: 'Open Sans, sans-serif' }}>Recent matches:</Typography>
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
                    {euroleagueGames.map((game, index) => renderMatch(game, index, 'basketball'))}
                  </Box>

                  {/* Live Matches Section */}
                  <Typography variant="h6" align="left" sx={{ mt: 2, fontWeight: 'bold', fontFamily: 'Open Sans, sans-serif' }}>Live matches:</Typography>
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
                      <Typography variant="body1" fontStyle="italic" fontFamily='Open Sans, sans-serif'>{euroleagueGamesLive.message}</Typography>
                    ) : (
                      euroleagueGamesLive.map((game, index) => renderLiveMatch(game, index, 'basketball'))
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
      {/* Sports Modals */}
      {modalOpen && selectedMatchDetails && (
        <>
          {page === 'soccer' ? (
            <MatchDetailsModal
              open={modalOpen}
              handleClose={() => {
                setModalOpen(false);
                setSelectedMatchDetails(null);
              }}
              matchData={selectedMatchDetails}
            />
          ) : (
            <BasketballMatchDetailsModal
              open={modalOpen}
              handleClose={() => {
                setModalOpen(false);
                setSelectedMatchDetails(null);
              }}
              matchData={selectedMatchDetails}
            />
          )}
        </>
      )}

      {/* Soccer Fixtures Modal */}
      {fixturesModalOpen && fixturesData && (
        <FixturesModal
          open={fixturesModalOpen}
          handleClose={() => {
            setFixturesModalOpen(false);
            setFixturesData(null);
          }}
          fixtures={fixturesData}
        />
      )}

      {/* Basketball Fixtures Modal */}
      {basketballFixturesModalOpen && basketballFixturesData && (
        <BasketballFixturesModal
          open={basketballFixturesModalOpen}
          handleClose={() => {
            setBasketballFixturesModalOpen(false);
            setBasketballFixturesData(null);
          }}
          fixtures={basketballFixturesData}
        />
      )}
    </ThemeProvider>
  );
}

export default Sports;