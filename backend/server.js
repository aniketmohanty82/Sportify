const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch')
const auth = require('./middleware/auth'); // Import the auth middleware

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://saiedupulapati4:jmzLsxDWeHqA6noc@cluster0.whqrr.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(conn => console.log(`MongoDB connected: ${conn.connection.name}`))  // Logs the connected database name
    .catch(err => console.log(err));

// Routes for fetching sports data
// Basketball Fixtures List
app.get('/api/basketball_fixtures/:leagueId', async (req, res) => {
    try {
        const leagueId = req.params.leagueId;

        // Get current date in EST
        const estDate = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
        const today = new Date(estDate);
        today.setHours(0, 0, 0, 0);  // Set to start of day

        // Determine season format based on league ID
        const season = leagueId === "120" ? "2024" : "2024-2025";

        const response = await fetch(
            `https://api-basketball.p.rapidapi.com/games?season=${season}&league=${leagueId}`,
            {
                headers: {
                    'x-rapidapi-host': 'api-basketball.p.rapidapi.com',
                    'x-rapidapi-key': '7e8649a2b4msh4a666a2f44b749ap1ddf50jsn1a277cc3521f'
                }
            }
        );

        const data = await response.json();

        // Filter games from today onwards and transform the response
        const fixtures = data.response
            .filter(game => {
                const gameDate = new Date(game.date);
                return gameDate >= today;
            })
            .map(game => ({
                fixture_id: game.id,
                date: game.date,
                time: game.time,
                venue: game.venue,
                teams: {
                    home: {
                        name: game.teams.home.name,
                        logo: game.teams.home.logo
                    },
                    away: {
                        name: game.teams.away.name,
                        logo: game.teams.away.logo
                    }
                },
                league: {
                    name: game.league.name,
                    logo: game.league.logo
                },
                status: game.status.long
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));  // Sort by date
        res.json(fixtures);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching fixtures');
    }
});
// Soccer Fixtures List
app.get('/api/fixtures/:leagueId', async (req, res) => {
    try {
        const leagueId = req.params.leagueId;
        const today = new Date().toISOString().split('T')[0];  // Format: YYYY-MM-DD

        const response = await fetch(
            `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${leagueId}&season=2024&from=${today}&to=2025-06-01`,
            {
                headers: {
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                    'x-rapidapi-key': '7e8649a2b4msh4a666a2f44b749ap1ddf50jsn1a277cc3521f'
                }
            }
        );

        const data = await response.json();

        // Transform the response to only include needed fields
        const fixtures = data.response.map(fixture => ({
            fixture_id: fixture.fixture.id,
            date: fixture.fixture.date,
            venue: {
                name: fixture.fixture.venue.name,
                city: fixture.fixture.venue.city
            },
            teams: {
                home: {
                    name: fixture.teams.home.name,
                    logo: fixture.teams.home.logo
                },
                away: {
                    name: fixture.teams.away.name,
                    logo: fixture.teams.away.logo
                }
            },
            status: fixture.fixture.status.long
        }));

        res.json(fixtures);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching fixtures');
    }
});

app.get('/api/fixture_details/:id', async (req, res) => {
    try {
        const fixtureId = req.params.id;
        const response = await fetch(
            `https://api-football-v1.p.rapidapi.com/v3/fixtures?id=${fixtureId}`,
            {
                headers: {
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                    'x-rapidapi-key': '7e8649a2b4msh4a666a2f44b749ap1ddf50jsn1a277cc3521f'
                }
            }
        );

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/api/basketball_fixture_details/:id', async (req, res) => {
    try {
        const fixtureId = req.params.id;
        const response = await fetch(
            `https://api-basketball.p.rapidapi.com/games?id=${fixtureId}`,
            {
                headers: {
                    'x-rapidapi-host': 'api-basketball.p.rapidapi.com',
                    'x-rapidapi-key': '7e8649a2b4msh4a666a2f44b749ap1ddf50jsn1a277cc3521f'
                }
            }
        );

        const data = await response.json();

        // No need to transform the data, just send it as is
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
// '7e8649a2b4msh4a666a2f44b749ap1ddf50jsn1a277cc3521f'
app.get('/api/premier_league', async (req, res) => {
    try {
        const currentDate = new Date();
        const startDate = '2024-08-01'; // Season start date
        const todayStr = currentDate.toISOString().split('T')[0];

        const response = await fetch(
            `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=39&season=2024&from=${startDate}&to=${todayStr}`,
            {
                headers: {
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                    'x-rapidapi-key': '7e8649a2b4msh4a666a2f44b749ap1ddf50jsn1a277cc3521f'
                }
            }
        );

        const data = await response.json();

        // Find the latest round from completed matches
        const latestRound = data.response.reduce((maxRound, match) => {
            if (match.fixture.status.short === "FT") {
                const roundNumber = parseInt(match.league.round.split(' - ')[1]);
                return roundNumber > maxRound ? roundNumber : maxRound;
            }
            return maxRound;
        }, 0);

        // Filter matches for the latest round
        const latestRoundMatches = data.response.filter(match =>
            match.league.round === `Regular Season - ${latestRound}`
        );

        const parsedGames = latestRoundMatches.map(game => ({
            date: game.fixture.date,
            teams: [
                game.teams.home.name,
                game.teams.away.name
            ],
            scores: [
                game.goals.home,
                game.goals.away
            ],
            team_logos: [
                game.teams.home.logo,
                game.teams.away.logo
            ],
            team_ids: [
                game.teams.home.id,
                game.teams.away.id
            ],
            fixture_id: game.fixture.id,
            status: game.fixture.status.long,
            venue: game.fixture.venue.name,
            round: game.league.round,
            referee: game.fixture.referee,

        }));
        res.json(parsedGames);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// MLS
app.get('/api/test_live', async (req, res) => {
    try {
        const response = await fetch(
            'https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all&league=135&season=2024',
            {
                headers: {
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                    'x-rapidapi-key': '7e8649a2b4msh4a666a2f44b749ap1ddf50jsn1a277cc3521f'
                }
            }
        );

        const data = await response.json();

        if (data.response && data.response.length > 0) {
            const liveGames = data.response.filter(game =>
                game.fixture.status.short === "1H" ||
                game.fixture.status.short === "2H" ||
                game.fixture.status.short === "HT"
            );

            if (liveGames.length > 0) {
                const parsedGames = liveGames.map(game => ({
                    teams: [
                        game.teams.home.name,
                        game.teams.away.name
                    ],
                    scores: [
                        game.goals.home,
                        game.goals.away
                    ],
                    in_game_time: game.fixture.status.elapsed,
                    fixture_id: game.fixture.id,
                }));

                res.json(parsedGames);
            } else {
                res.json({ message: "No live games are being played right now" });
            }
        } else {
            res.json({ message: "No teams are playing right now" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});





// test
app.get('/api/ucl_live', async (req, res) => {
    try {
        const response = await fetch(
            'https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all&league=2&season=2024',
            {
                headers: {
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                    'x-rapidapi-key': '7e8649a2b4msh4a666a2f44b749ap1ddf50jsn1a277cc3521f'
                }
            }
        );

        const data = await response.json();

        if (data.response && data.response.length > 0) {
            const liveGames = data.response.filter(game =>
                game.fixture.status.short === "1H" ||
                game.fixture.status.short === "2H" ||
                game.fixture.status.short === "HT"
            );

            if (liveGames.length > 0) {
                const parsedGames = liveGames.map(game => ({
                    teams: [
                        game.teams.home.name,
                        game.teams.away.name
                    ],
                    scores: [
                        game.goals.home,
                        game.goals.away
                    ],
                    in_game_time: game.fixture.status.elapsed,
                    fixture_id: game.fixture.id,
                }));

                res.json(parsedGames);
            } else {
                res.json({ message: "No live games are being played right now" });
            }
        } else {
            res.json({ message: "No teams are playing right now" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

//uefa champions league games recent
app.get('/api/ucl', async (req, res) => {
    try {
        const currentDate = new Date();
        const startDate = '2024-08-01'; // Season start date
        const todayStr = currentDate.toISOString().split('T')[0];

        const response = await fetch(
            `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=2&season=2024&from=${startDate}&to=${todayStr}`,
            {
                headers: {
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                    'x-rapidapi-key': '7e8649a2b4msh4a666a2f44b749ap1ddf50jsn1a277cc3521f'
                }
            }
        );

        const data = await response.json();

        // Find the latest round from completed matches
        const latestRound = data.response.reduce((maxRound, match) => {
            if (match.fixture.status.short === "FT") {
                const roundNumber = parseInt(match.league.round.split(' - ')[1]);
                return roundNumber > maxRound ? roundNumber : maxRound;
            }
            return maxRound;
        }, 0);

        // Filter matches for the latest round
        const latestRoundMatches = data.response.filter(match =>
            match.league.round === `League Stage - ${latestRound}`
        );

        // have to add knockouts here eventually

        const parsedGames = latestRoundMatches.map(game => ({
            date: game.fixture.date,
            teams: [
                game.teams.home.name,
                game.teams.away.name
            ],
            scores: [
                game.goals.home,
                game.goals.away
            ],
            team_logos: [
                game.teams.home.logo,
                game.teams.away.logo
            ],
            team_ids: [
                game.teams.home.id,
                game.teams.away.id
            ],
            fixture_id: game.fixture.id,
            status: game.fixture.status.long,
            venue: game.fixture.venue.name,
            round: game.league.round,
            referee: game.fixture.referee,

        }));
        res.json(parsedGames);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// premier league games on today
app.get('/api/premier_league_live', async (req, res) => {
    try {
        const response = await fetch(
            'https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all&league=39&season=2024',
            {
                headers: {
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                    'x-rapidapi-key': '7e8649a2b4msh4a666a2f44b749ap1ddf50jsn1a277cc3521f'
                }
            }
        );

        const data = await response.json();

        if (data.response && data.response.length > 0) {
            const liveGames = data.response.filter(game =>
                game.fixture.status.short === "1H" ||
                game.fixture.status.short === "2H" ||
                game.fixture.status.short === "HT"
            );

            if (liveGames.length > 0) {
                const parsedGames = liveGames.map(game => ({
                    teams: [
                        game.teams.home.name,
                        game.teams.away.name
                    ],
                    scores: [
                        game.goals.home,
                        game.goals.away
                    ],
                    in_game_time: game.fixture.status.elapsed,
                    fixture_id: game.fixture.id,
                }));

                res.json(parsedGames);
            } else {
                res.json({ message: "No live games are being played right now" });
            }
        } else {
            res.json({ message: "No teams are playing right now" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/api/bundesliga_live', async (req, res) => {
    try {
        const response = await fetch(
            'https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all&league=78&season=2024',
            {
                headers: {
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                    'x-rapidapi-key': '7e8649a2b4msh4a666a2f44b749ap1ddf50jsn1a277cc3521f'
                }
            }
        );

        const data = await response.json();

        if (data.response && data.response.length > 0) {
            const liveGames = data.response.filter(game =>
                game.fixture.status.short === "1H" ||
                game.fixture.status.short === "2H" ||
                game.fixture.status.short === "HT"
            );

            if (liveGames.length > 0) {
                const parsedGames = liveGames.map(game => ({
                    teams: [
                        game.teams.home.name,
                        game.teams.away.name
                    ],
                    scores: [
                        game.goals.home,
                        game.goals.away
                    ],
                    in_game_time: game.fixture.status.elapsed,
                    fixture_id: game.fixture.id,
                }));

                res.json(parsedGames);
            } else {
                res.json({ message: "No live games are being played right now" });
            }
        } else {
            res.json({ message: "No teams are playing right now" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/api/bundesliga', async (req, res) => {
    try {
        const currentDate = new Date();
        const startDate = '2024-08-01'; // Season start date
        const todayStr = currentDate.toISOString().split('T')[0];

        const response = await fetch(
            `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=78&season=2024&from=${startDate}&to=${todayStr}`,
            {
                headers: {
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                    'x-rapidapi-key': '7e8649a2b4msh4a666a2f44b749ap1ddf50jsn1a277cc3521f'
                }
            }
        );

        const data = await response.json();

        // Find the latest round from completed matches
        const latestRound = data.response.reduce((maxRound, match) => {
            if (match.fixture.status.short === "FT") {
                const roundNumber = parseInt(match.league.round.split(' - ')[1]);
                return roundNumber > maxRound ? roundNumber : maxRound;
            }
            return maxRound;
        }, 0);

        // Filter matches for the latest round
        const latestRoundMatches = data.response.filter(match =>
            match.league.round === `Regular Season - ${latestRound}`
        );

        const parsedGames = latestRoundMatches.map(game => ({
            date: game.fixture.date,
            teams: [
                game.teams.home.name,
                game.teams.away.name
            ],
            scores: [
                game.goals.home,
                game.goals.away
            ],
            team_logos: [
                game.teams.home.logo,
                game.teams.away.logo
            ],
            team_ids: [
                game.teams.home.id,
                game.teams.away.id
            ],
            fixture_id: game.fixture.id,
            status: game.fixture.status.long,
            venue: game.fixture.venue.name,
            round: game.league.round,
            referee: game.fixture.referee,

        }));
        res.json(parsedGames);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/api/nba', async (req, res) => {
    try {
        // Get current date and previous two days
        const dates = [];
        for (let i = 0; i < 3; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split('T')[0]);
        }

        const allGames = [];

        // Make API calls for each date
        for (const date of dates) {
            const response = await fetch(
                `https://api-basketball.p.rapidapi.com/games?timezone=ET&season=2024-2025&league=12&date=${date}`,
                {
                    headers: {
                        'x-rapidapi-host': 'api-basketball.p.rapidapi.com',
                        'x-rapidapi-key': '7e8649a2b4msh4a666a2f44b749ap1ddf50jsn1a277cc3521f'
                    }
                }
            );

            const data = await response.json();

            if (data.response) {
                // Filter for finished games (both FT and AOT status)
                const finishedGames = data.response.filter(game =>
                    game.status.short === "FT" || game.status.short === "AOT"
                ).map(game => ({
                    teams: [
                        game.teams.home.name,
                        game.teams.away.name
                    ],
                    scores: [
                        game.scores.home.total,
                        game.scores.away.total
                    ],
                    status: game.status.long,
                    date: game.date,
                    venue: game.venue,
                    fixture_id: game.id
                }));

                allGames.push(...finishedGames);
            }
        }

        if (allGames.length > 0) {
            //console.log(allGames);
            res.json(allGames);
        } else {
            res.json({ message: "No finished games in the past three days" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/api/nba_live', async (req, res) => {
    try {
        // Get current date in ET and convert to UTC
        const etDate = new Date();
        const utcDate = new Date(etDate.toLocaleString('en-US', { timeZone: 'UTC' }));
        const formattedDate = utcDate.toISOString().split('T')[0];

        const response = await fetch(
            `https://api-basketball.p.rapidapi.com/games?timezone=ET&season=2024-2025&league=12&date=${formattedDate}`,
            {
                headers: {
                    'x-rapidapi-host': 'api-basketball.p.rapidapi.com',
                    'x-rapidapi-key': '7e8649a2b4msh4a666a2f44b749ap1ddf50jsn1a277cc3521f'
                }
            }
        );

        const data = await response.json();

        if (data.response && data.response.length > 0) {
            const liveGames = data.response.filter(game =>
                game.status.short.includes('Q') ||
                game.status.long.includes('Half')
            ).map(game => ({
                teams: [
                    game.teams.home.name,
                    game.teams.away.name
                ],
                scores: [
                    game.scores.home.total,
                    game.scores.away.total
                ],
                in_game_time: `${game.status.long}${game.status.timer ? ` - ${game.status.timer}:00` : ''}`,
                fixture_id: game.id
            }));

            if (liveGames.length > 0) {
                res.json(liveGames);
            } else {
                res.json({ message: "No live games right now" });
            }
        } else {
            res.json({ message: "No games data available" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// change to tue, wed, thu, fri
app.get('/api/euroleague', async (req, res) => {
    try {
        // Get current date and previous two days
        const dates = [];
        for (let i = 0; i < 3; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split('T')[0]);
        }

        const allGames = [];

        // Make API calls for each date
        for (const date of dates) {
            const response = await fetch(
                `https://api-basketball.p.rapidapi.com/games?timezone=ET&season=2024&league=120&date=${date}`,
                {
                    headers: {
                        'x-rapidapi-host': 'api-basketball.p.rapidapi.com',
                        'x-rapidapi-key': '7e8649a2b4msh4a666a2f44b749ap1ddf50jsn1a277cc3521f'
                    }
                }
            );

            const data = await response.json();

            if (data.response) {
                // Filter for finished games (both FT and AOT status)
                const finishedGames = data.response.filter(game =>
                    game.status.short === "FT" || game.status.short === "AOT"
                ).map(game => ({
                    teams: [
                        game.teams.home.name,
                        game.teams.away.name
                    ],
                    scores: [
                        game.scores.home.total,
                        game.scores.away.total
                    ],
                    status: game.status.long,
                    date: game.date,
                    venue: game.venue,
                    fixture_id: game.id
                }));

                allGames.push(...finishedGames);
            }
        }

        if (allGames.length > 0) {
            // console.log(allGames);
            res.json(allGames);
        } else {
            res.json({ message: "No finished games in the past three days" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/api/euroleague_live', async (req, res) => {
    try {
        // Get current date in ET and convert to UTC
        const etDate = new Date();
        const utcDate = new Date(etDate.toLocaleString('en-US', { timeZone: 'UTC' }));
        const formattedDate = utcDate.toISOString().split('T')[0];

        const response = await fetch(
            `https://api-basketball.p.rapidapi.com/games?timezone=ET&season=2024&league=120&date=${formattedDate}`,
            {
                headers: {
                    'x-rapidapi-host': 'api-basketball.p.rapidapi.com',
                    'x-rapidapi-key': '7e8649a2b4msh4a666a2f44b749ap1ddf50jsn1a277cc3521f'
                }
            }
        );

        const data = await response.json();

        if (data.response && data.response.length > 0) {
            const liveGames = data.response.filter(game =>
                game.status.short.includes('Q') ||
                game.status.long.includes('Half')
            ).map(game => ({
                teams: [
                    game.teams.home.name,
                    game.teams.away.name
                ],
                scores: [
                    game.scores.home.total,
                    game.scores.away.total
                ],
                in_game_time: `${game.status.long}${game.status.timer ? ` - ${game.status.timer}:00` : ''}`,
                fixture_id: game.id
            }));

            if (liveGames.length > 0) {
                res.json(liveGames);
            } else {
                res.json({ message: "No live games right now" });
            }
        } else {
            res.json({ message: "No games data available" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// Meal logging routes
const MealLog = require('./models/MealLog');

app.post('/api/meals/logmeal', async (req, res) => {
    try {
        const mealLog = new MealLog(req.body);
        await mealLog.save();
        res.status(201).json({ message: "Meal logged successfully", data: mealLog });
    } catch (error) {
        console.error("Error logging the meal", error);
        res.status(500).json({ message: "Error logging the meal", error });
    }
});

app.get('/api/meals', auth, async (req, res) => {
    try {
        // Get the current date in YYYY-MM-DD format
        const currentDate = new Date();
        const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); // Set the time to the start of the day
        const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)); // Set the time to the end of the day

        // Find meals logged on the current date
        const mealLogs = await MealLog.find({
            userId: req.user.id,  // Filter by the current user's ID
            date: {
                $gte: startOfDay,  // Greater than or equal to start of day
                $lt: endOfDay      // Less than end of day
            }
        });

        res.status(200).json(mealLogs);
    } catch (error) {
        console.error("Error fetching meal logs", error);
        res.status(500).json({ message: "Error fetching meal logs", error });
    }
});

app.get('/api/mealsPast', auth, async (req, res) => {
    try {
        // Get the current date
        const currentDate = new Date();

        // Calculate the start date for the past seven days
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 7); // Set to 7 days before

        // Set the time for the start of the day for both dates
        const startOfStartDate = new Date(startDate.setHours(0, 0, 0, 0)); // Start of the day 7 days ago
        const endOfCurrentDate = new Date(currentDate.setHours(23, 59, 59, 999)); // End of the current day

        // Find meals logged in the last seven days
        const mealLogs = await MealLog.find({
            userId: req.user.id, // Filter by the current user's ID
            date: {
                $gte: startOfStartDate, // Greater than or equal to start of start date
                $lt: endOfCurrentDate // Less than end of current date
            }
        });

        res.status(200).json(mealLogs);
    } catch (error) {
        console.error("Error fetching meal logs", error);
        res.status(500).json({ message: "Error fetching meal logs", error });
    }
});


app.put('/api/meals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMealLog = await MealLog.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMealLog) {
            return res.status(404).json({ message: "Meal log not found" });
        }
        res.status(200).json({ message: "Meal log updated successfully", data: updatedMealLog });
    } catch (error) {
        console.error("Error updating meal log", error);
        res.status(500).json({ message: "Error updating meal log", error });
    }
});

app.delete('/api/meals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMealLog = await MealLog.findByIdAndDelete(id);
        if (!deletedMealLog) {
            return res.status(404).json({ message: "Meal log not found" });
        }
        res.status(200).json({ message: "Meal log deleted successfully" });
    } catch (error) {
        console.error("Error deleting meal log", error);
        res.status(500).json({ message: "Error deleting meal log", error });
    }
});

const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

// @route   GET api/exports/calories
// @desc    Export calorie summaries as PDF or CSV
// @access  Private
app.get('/api/calories/export', auth, async (req, res) => {
  const { format, timeframe } = req.query; // Get format (pdf/csv) and timeframe (daily/weekly/monthly)

  if (!format || !timeframe) {
    return res.status(400).json({ msg: 'Please specify both format and timeframe.' });
  }

  try {
    // Determine date range based on the timeframe
    const currentDate = new Date();
    let startDate;
    if (timeframe === 'daily') {
      startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === 'weekly') {
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 7);
    } else if (timeframe === 'monthly') {
      startDate = new Date(currentDate);
      startDate.setMonth(currentDate.getMonth() - 1);
    } else {
      return res.status(400).json({ msg: 'Invalid timeframe. Choose "daily", "weekly", or "monthly".' });
    }

    // Find meals within the date range
    const mealLogs = await MealLog.find({
      userId: req.user.id,
      date: { $gte: startDate, $lt: currentDate },
    }).sort({ date: -1 });

    // Group meals by date and calculate total calories and nutrients for each day
    const groupedData = mealLogs.reduce((acc, meal) => {
      const date = meal.date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = {
          date,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFats: 0,
          totalFiber: 0,
          totalSodium: 0,
        };
      }
      acc[date].totalCalories += meal.nutrients;
      acc[date].totalProtein += meal.protein;
      acc[date].totalCarbs += meal.carbs;
      acc[date].totalFats += meal.fats;
      acc[date].totalFiber += meal.fiber;
      acc[date].totalSodium += meal.sodium;
      return acc;
    }, {});

    const summaryData = Object.values(groupedData); // Convert grouped data to an array

    // Export as CSV
    if (format === 'csv') {
      const fields = ['date', 'totalCalories', 'totalProtein', 'totalCarbs', 'totalFats', 'totalFiber', 'totalSodium'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(summaryData);
      res.header('Content-Type', 'text/csv');
      res.attachment(`calorie_summary_${timeframe}.csv`);
      return res.send(csv);
    }

    // Export as PDF
    if (format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Disposition', `attachment; filename=calorie_summary_${timeframe}.pdf`);
      res.setHeader('Content-Type', 'application/pdf');
      doc.pipe(res);

      // PDF Title
      doc.fontSize(20).text(`Calorie Summary - ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}`, {
        align: 'center',
      });

      // Populate PDF with data
      summaryData.forEach((item) => {
        doc
          .fontSize(16)
          .text(`Date: ${item.date}`, { underline: true, lineGap: 5 });
        
        doc
          .fontSize(12)
          .text(`Total Calories: ${item.totalCalories}`, { lineGap: 2 })
          .text(`Protein: ${item.totalProtein}g`, { lineGap: 2 })
          .text(`Carbs: ${item.totalCarbs}g`, { lineGap: 2 })
          .text(`Fats: ${item.totalFats}g`, { lineGap: 2 })
          .text(`Fiber: ${item.totalFiber}g`, { lineGap: 2 })
          .text(`Sodium: ${item.totalSodium}mg`, { lineGap: 5 });
          
        doc.moveDown();
      });

      doc.end();
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error while exporting calorie data');
  }
});


// User routes and protected routes
const workoutsRouter = require('./routes/workouts');
app.use('/api/workouts', workoutsRouter); // Workout routes
const runsRouter = require('./routes/runs');
app.use('/api/runs', runsRouter); // Run routes
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
const workoutPlansRouter = require('./routes/workoutplans');
app.use('/api/workoutplans', workoutPlansRouter);


const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);


app.get('/tracker', auth, (req, res) => {
    res.json({ message: 'Welcome to the protected tracker route' });
});

// Root route
app.get('/', (req, res) => {
    res.send('Hello from the backend');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});