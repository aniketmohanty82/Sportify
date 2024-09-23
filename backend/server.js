import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch'


dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
// Need to make MongoDB account and add the URL as a env var:
/// like this: MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
// MONGO_URI = 'mongodb+srv://saiedupulapati4:jmzLsxDWeHqA6noc@cluster0.whqrr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

const database_MONGO_URI = 'mongodb+srv://saiedupulapati4:jmzLsxDWeHqA6noc@cluster0.whqrr.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(database_MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((conn) => {
        console.log(`MongoDB connected: ${conn.connection.name}`);  // This will log the connected database name
    })
    .catch((err) => console.log(err));

// Routes
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
});

const User = mongoose.model('User', userSchema, 'myCollection');

// API route to fetch data
app.get('/api/users', async (req, res) => {
    try {
        console.log('Mongo URI:', process.env.MONGO_URI);
        const users = await User.find();
        console.log(users)
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/api/premier_league', async (req, res) => {
    try {
        const response = await fetch('https://serpapi.com/search.json?q=google+sports+premier+league+games+played+list&location=indianapolis,+indiana,+united+states&api_key=82f5da5e041817f2a31eeb62e5ca61983a53bd7300e24abc03a5e93a8ca26676');
        const data = await response.json();
        // Extracting games
        const games = data.sports_results.games;

        // Extracting team names and scores from each game
        const parsedGames = games.map(game => ({
            teams: game.teams.map(team => team.name),
            scores: game.teams.map(team => team.score)
        }));

        // Send parsed data as response
        console.log(parsedGames)
        res.json(parsedGames);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/api/la_liga', async (req, res) => {
    try {
        const response = await fetch('https://serpapi.com/search.json?q=google+sports+la+liga+games+last+week&location=indianapolis,+indiana,+united+states&api_key=82f5da5e041817f2a31eeb62e5ca61983a53bd7300e24abc03a5e93a8ca26676');
        const data = await response.json();
        // Extracting games
        const games = data.sports_results.games;

        // Extracting team names and scores from each game
        const parsedGames = games.map(game => ({
            teams: game.teams.map(team => team.name),
            scores: game.teams.map(team => team.score)
        }));

        // Send parsed data as response
        console.log(parsedGames)
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
        // Extracting games
        const games = data.sports_results.games;

        // Extracting team names and scores from each game
        const parsedGames = games.map(game => ({
            teams: game.teams.map(team => team.name),
            scores: game.teams.map(team => team.score)
        }));

        // Send parsed data as response
        console.log(parsedGames)
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
        // Extracting games
        const games = data.sports_results.games;

        // Extracting team names and scores from each game
        const parsedGames = games.map(game => ({
            teams: game.teams.map(team => team.name),
            scores: game.teams.map(team => team.score)
        }));

        // Send parsed data as response
        console.log(parsedGames)
        res.json(parsedGames);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

//q=euroleague+games+2023%2F2024

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});
