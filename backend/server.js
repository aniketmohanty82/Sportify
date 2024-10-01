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
        const response = await fetch('https://serpapi.com/search.json?q=google+sports+premier+league+games+played&location=indianapolis,+indiana,+united+states&api_key=82f5da5e041817f2a31eeb62e5ca61983a53bd7300e24abc03a5e93a8ca26676');
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

app.get('/api/bundesliga', async (req, res) => {
    try {
        const response = await fetch('https://serpapi.com/search.json?q=google+sports+bundesliga+games+played+list&location=indianapolis,+indiana,+united+states&api_key=82f5da5e041817f2a31eeb62e5ca61983a53bd7300e24abc03a5e93a8ca26676');
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
        const response = await fetch('https://serpapi.com/search.json?q=nba+2023%2F2024+games&location=indianapolis,+indiana,+united+states&api_key=82f5da5e041817f2a31eeb62e5ca61983a53bd7300e24abc03a5e93a8ca26676');
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
        const response = await fetch('https://serpapi.com/search.json?q=euroleague+games+2023%2F2024&location=indianapolis,+indiana,+united+states&api_key=82f5da5e041817f2a31eeb62e5ca61983a53bd7300e24abc03a5e93a8ca26676');
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
        // Get the current date in YYYY-MM-DD format
        const currentDate = new Date();
        const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); // Set the time to the start of the day
        const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)); // Set the time to the end of the day

        // Find meals logged on the current date
        const mealLogs = await MealLog.find({
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
