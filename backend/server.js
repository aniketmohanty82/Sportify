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
        const response = await fetch('https://serpapi.com/search.json?q=premier+league+games+played+so+far&location=indianapolis,+indiana,+united+states&api_key=5a3e9946072de5106decb13c65c5c09384fc0ab71fe065616f94e0b8c33ba1ac');
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


// test
app.get('/api/test', async (req, res) => {
    try {
        const response = await fetch('https://serpapi.com/search.json?q=uefa+champions+league+games+on+today&location=indianapolis,+indiana,+united+states&api_key=5a3e9946072de5106decb13c65c5c09384fc0ab71fe065616f94e0b8c33ba1ac');
        const data = await response.json();
        const liveGames = data.sports_results.games.filter(game => game.status && game.status.includes("Live"))
            .map(game => ({
                teams: game.teams.map(team => team.name),
                scores: game.teams.map(team => team.score),
                minute: game.status.match(/\d+/)[0],  // Extract minute from the status string
                status: game.status
            }));

        // Check if live games exist and return them
        if (liveGames.length > 0) {
            res.json(liveGames);
        } else {
            res.json({ message: "No live games right now" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

//uefa champions league games today

// premier league games on today
app.get('/api/premier_league_live', async (req, res) => {
    try {
        const response = await fetch('https://serpapi.com/search.json?q=premier+league+games+on+today&location=indianapolis,+indiana,+united+states&api_key=5a3e9946072de5106decb13c65c5c09384fc0ab71fe065616f94e0b8c33ba1ac');
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
        const response = await fetch('https://serpapi.com/search.json?q=google+sports+bundesliga+games+played+list&location=indianapolis,+indiana,+united+states&api_key=5a3e9946072de5106decb13c65c5c09384fc0ab71fe065616f94e0b8c33ba1ac');
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

app.get('/api/nba', async (req, res) => {
    try {
        const response = await fetch('https://serpapi.com/search.json?q=nba+2023%2F2024+games&location=indianapolis,+indiana,+united+states&api_key=5a3e9946072de5106decb13c65c5c09384fc0ab71fe065616f94e0b8c33ba1ac');
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

app.get('/api/euroleague', async (req, res) => {
    try {
        const response = await fetch('https://serpapi.com/search.json?q=euroleague+games+2023%2F2024&location=indianapolis,+indiana,+united+states&api_key=5a3e9946072de5106decb13c65c5c09384fc0ab71fe065616f94e0b8c33ba1ac');
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
        const response = await fetch('https://serpapi.com/search.json?q=euroleague+games+on+today&location=indianapolis,+indiana,+united+states&api_key=5a3e9946072de5106decb13c65c5c09384fc0ab71fe065616f94e0b8c33ba1ac');
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
        const response = await fetch('https://serpapi.com/search.json?q=wnba+games+on+today&location=indianapolis,+indiana,+united+states&api_key=5a3e9946072de5106decb13c65c5c09384fc0ab71fe065616f94e0b8c33ba1ac');
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

app.get('/api/meals', async (req, res) => {
    try {
        const mealLogs = await MealLog.find();
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
