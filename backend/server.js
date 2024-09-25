const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
// Need to make MongoDB account and add the URL as a env var:
// like this: MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://saiedupulapati4:jmzLsxDWeHqA6noc@cluster0.whqrr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// MealLog model
const MealLog = require('./models/MealLog');

// Add meal log routes
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
        const mealLogs = await MealLog.find(); // Fetch all meal logs from the database
        console.log("Meal logs retrieved:", mealLogs); // Log to the console
        res.status(200).json(mealLogs); // Send the meal logs back to the client
    } catch (error) {
        console.error("Error fetching meal logs:", error);
        res.status(500).json({ message: "Error fetching meal logs", error });
    }
});

// Edit meal log route
app.put('/api/meals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMealLog = await MealLog.findByIdAndUpdate(id, req.body, { new: true }); // Update and return the updated document
        if (!updatedMealLog) {
            return res.status(404).json({ message: "Meal log not found" });
        }
        res.status(200).json({ message: "Meal log updated successfully", data: updatedMealLog });
    } catch (error) {
        console.error("Error updating meal log:", error);
        res.status(500).json({ message: "Error updating meal log", error });
    }
});

// Delete meal log route
app.delete('/api/meals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMealLog = await MealLog.findByIdAndDelete(id); // Delete the meal log
        if (!deletedMealLog) {
            return res.status(404).json({ message: "Meal log not found" });
        }
        res.status(200).json({ message: "Meal log deleted successfully" });
    } catch (error) {
        console.error("Error deleting meal log:", error);
        res.status(500).json({ message: "Error deleting meal log", error });
    }
});

// Routes
app.get('/', (req, res) => {
    res.send('Hello from the backend');
});

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
