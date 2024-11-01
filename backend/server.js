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
app.get('/api/premier_league', async (req, res) => {
    try {
        const currentDate = new Date();
        const dayOfWeek = currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
        
        const lastSunday = new Date(currentDate);
        lastSunday.setDate(currentDate.getDate() - dayOfWeek);
        
        const lastSaturday = new Date(lastSunday);
        lastSaturday.setDate(lastSunday.getDate() - 1);
        
        const lastMonday = new Date(lastSunday);
        lastMonday.setDate(lastSunday.getDate() - 6);

        const dates = [lastSaturday, lastSunday, lastMonday].map(date => date.toISOString().split('T')[0]);

        const games = [];

        for (const date of dates) {
            const response = await fetch(`https://serpapi.com/search.json?q=premier+league+games+${date}&location=indianapolis,+indiana,+united+states&api_key=7a3a7c728b90a1b0180fc7f419675ca3be9f915794400b74787cc71cfec19a97`);
            const data = await response.json();
            if (data.sports_results && data.sports_results.games) {
                games.push(...data.sports_results.games);
            }
        }

        const parsedGames = games.map(game => ({
            date: game.date,
            teams: game.teams.map(team => team.name),
            scores: game.teams.map(team => team.score),
            status: game.status
        }));

        res.json(parsedGames);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// test
app.get('/api/test', async (req, res) => {
    try {
        const response = await fetch('https://serpapi.com/search.json?q=uefa+champions+league+games+on+today&location=indianapolis,+indiana,+united+states&api_key=7a3a7c728b90a1b0180fc7f419675ca3be9f915794400b74787cc71cfec19a97');
        const data = await response.json();

        // Check if the API returned an error
        if (data.error) {
            console.error('API Error:', data.error);
            return res.status(500).json({ message: "Error fetching data from API" });
        }

        // Check if sports_results exists
        if (!data.sports_results || !data.sports_results.games) {
            return res.json({ message: "No games data available" });
        }

        const liveGames = data.sports_results.games
            .filter(game => game.status && game.status.includes("Live"))
            .map(game => ({
                teams: game.teams.map(team => team.name),
                scores: game.teams.map(team => team.score),
                minute: game.status.match(/\d+/)?.[0] || 'N/A',  // Extract minute from the status string, use 'N/A' if not found
                status: game.status
            }));

        // Check if live games exist and return them
        if (liveGames.length > 0) {
            res.json(liveGames);
        } else {
            res.json({ message: "No live games right now" });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

//uefa champions league games recent
app.get('/api/ucl', async (req, res) => {
    try {
        const currentDate = new Date();
        const dayOfWeek = currentDate.getDay();

        // Calculate last Wednesday, Tuesday, and Thursday
        const lastWednesday = new Date(currentDate);
        lastWednesday.setDate(currentDate.getDate() - ((dayOfWeek + 4) % 7));

        const lastTuesday = new Date(currentDate);
        lastTuesday.setDate(currentDate.getDate() - ((dayOfWeek + 5) % 7));

        const lastThursday = new Date(currentDate);
        lastThursday.setDate(currentDate.getDate() - ((dayOfWeek + 3) % 7));

        const dates = [lastTuesday, lastWednesday, lastThursday].map(date => date.toISOString().split('T')[0]);
        console.log(dates);

        const allGames = [];

        for (const date of dates) {
            const response = await fetch(`https://serpapi.com/search.json?q=uefa+champions+league+games+${date}&location=indianapolis,+indiana,+united+states&api_key=7a3a7c728b90a1b0180fc7f419675ca3be9f915794400b74787cc71cfec19a97`);
            const data = await response.json();
            if (data.sports_results && data.sports_results.games) {
                allGames.push(...data.sports_results.games);
            }
        }

        const parsedGames = allGames.map(game => ({
            date: game.date,
            teams: game.teams.map(team => team.name),
            scores: game.teams.map(team => team.score),
            status: game.status
        }));

        if (parsedGames.length > 0) {
            res.json(parsedGames);
        } else {
            res.json({ message: "No games found for the past Tuesday, Wednesday, and Thursday" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// premier league games on today
app.get('/api/premier_league_live', async (req, res) => {
    try {
        const response = await fetch('https://serpapi.com/search.json?q=premier+league+games+on+today&location=indianapolis,+indiana,+united+states&api_key=7a3a7c728b90a1b0180fc7f419675ca3be9f915794400b74787cc71cfec19a97');
        const data = await response.json();

        if (data.sports_results && data.sports_results.game_spotlight) {
            const game = data.sports_results.game_spotlight;
            if (game.status === 'Live') {
                const parsedGame = {
                    teams: game.teams.map(team => team.name),
                    scores: game.teams.map(team => team.score),
                    in_game_time: game.in_game_time.minute,
                };
                res.json(parsedGame);
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
        const dayOfWeek = currentDate.getDay();

        const lastSunday = new Date(currentDate);
        lastSunday.setDate(currentDate.getDate() - dayOfWeek);

        const lastSaturday = new Date(lastSunday);
        lastSaturday.setDate(lastSunday.getDate() - 1);

        const lastFriday = new Date(lastSunday);
        lastFriday.setDate(lastSunday.getDate() - 2);

        const today = new Date();
        const dates = [lastFriday, lastSaturday, lastSunday]
            .filter(date => date <= today)
            .map(date => date.toISOString().split('T')[0]);

        const allGames = [];

        for (const date of dates) {
            const response = await fetch(`https://serpapi.com/search.json?q=bundesliga+games+${date}&location=indianapolis,+indiana,+united+states&api_key=7a3a7c728b90a1b0180fc7f419675ca3be9f915794400b74787cc71cfec19a97`);
            const data = await response.json();
            if (data.sports_results && data.sports_results.games) {
                allGames.push(...data.sports_results.games);
            }
        }

        const parsedGames = allGames.map(game => ({
            date: game.date,
            teams: game.teams.map(team => team.name),
            scores: game.teams.map(team => team.score),
            status: game.status
        }));

        res.json(parsedGames);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/api/nba', async (req, res) => {
    try {
        const response = await fetch('https://serpapi.com/search.json?q=nba+finals+2023%2F2024+games&location=indianapolis,+indiana,+united+states&api_key=7a3a7c728b90a1b0180fc7f419675ca3be9f915794400b74787cc71cfec19a97');
        const data = await response.json();
        const games = data.sports_results.games;
        const parsedGames = games.map(game => ({
            teams: game.teams.map(team => team.name),
            scores: game.teams.map(team => team.score)
        }));
        res.json(parsedGames);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/api/nba_live', async (req, res) => {
    try {
        const response = await fetch('https://serpapi.com/search.json?q=NBA+games+on+today&location=indianapolis,+indiana,+united+states&api_key=7a3a7c728b90a1b0180fc7f419675ca3be9f915794400b74787cc71cfec19a97');
        const data = await response.json();

        if (data.sports_results && data.sports_results.games) {
            const liveGames = data.sports_results.games.filter(game => game.status && (game.status.includes("Q") || game.status.includes("Halftime")))
                .map(game => ({
                    teams: game.teams.map(team => team.name),
                    scores: game.teams.map(team => team.score),
                    status: game.status
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

app.get('/api/euroleague', async (req, res) => {
    try {
        const response = await fetch('https://serpapi.com/search.json?q=euroleague+games+2023%2F2024&location=indianapolis,+indiana,+united+states&api_key=7a3a7c728b90a1b0180fc7f419675ca3be9f915794400b74787cc71cfec19a97');
        const data = await response.json();
        const games = data.sports_results.games;
        const parsedGames = games.map(game => ({
            teams: game.teams.map(team => team.name),
            scores: game.teams.map(team => team.score)
        }));
        res.json(parsedGames);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/api/euroleague_live', async (req, res) => {
    try {
        const response = await fetch('https://serpapi.com/search.json?q=euroleague+games+on+today&location=indianapolis,+indiana,+united+states&api_key=7a3a7c728b90a1b0180fc7f419675ca3be9f915794400b74787cc71cfec19a97');
        const data = await response.json();

        if (data.sports_results && data.sports_results.games) {
            const liveGames = data.sports_results.games.filter(game => game.status && (game.status.includes("Q") || game.status.includes("Halftime")))
                .map(game => ({
                    teams: game.teams.map(team => team.name),
                    scores: game.teams.map(team => team.score),
                    status: game.status
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

app.get('/api/wnba', async (req, res) => {
    try {
        const response = await fetch('https://serpapi.com/search.json?q=wnba+games+on+today&location=indianapolis,+indiana,+united+states&api_key=7a3a7c728b90a1b0180fc7f419675ca3be9f915794400b74787cc71cfec19a97');
        const data = await response.json();

        if (data.sports_results.game_spotlight && data.sports_results.game_spotlight.status === 'Live') {
            const game = data.sports_results.game_spotlight;
            const parsedGame = {
                teams: game.teams.map(team => team.name),
                scores: game.teams.map(team => team.score),
                in_game_time: game.in_game_time.minute,
            };
            console.log(parsedGame)
            res.json(parsedGame);
        } else {
            res.json({ message: "No teams are playing right now" });
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

// User routes and protected routes
const workoutsRouter = require('./routes/workouts');
app.use('/api/workouts', workoutsRouter); // Workout routes
const runsRouter = require('./routes/runs');
app.use('/api/runs', runsRouter); // Run routes
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

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
