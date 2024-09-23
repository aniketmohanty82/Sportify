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
/// like this: MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority

MONGO_URI = 'mongodb+srv://saiedupulapati4:jmzLsxDWeHqA6noc@cluster0.whqrr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Add meal log routes
//const mealLogs = require('./routes/mealLogs');
const router = express.Router();
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

module.exports = router;

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

// Routes
app.get('/', (req, res) => {
    res.send('Hello from the backend');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
