/*backend/routes/ai.js*/

const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const parseExercises = (description) => {
  const exercises = [];
  const lines = description.split("\n"); // Split AI response into lines

  let currentCategory = null;

  lines.forEach((line) => {
    line = line.trim(); // Clean up whitespace

    // Match categories like "Warm-up (10):"
    const categoryMatch = line.match(/^(.+?)\s\((\d+)\):$/);
    if (categoryMatch) {
      currentCategory = {
        name: categoryMatch[1].trim(), // Category name (e.g., "Warm-up")
        duration: parseInt(categoryMatch[2], 10), // Duration in minutes
      };
      return; // Skip to the next line after finding a category
    }

    // Match exercises like "- Jogging: 5 minutes of jogging to get the heart rate up"
    const exerciseMatch = line.match(/-\s(.+?):\s.*?(\d+)\sminutes/);
    if (exerciseMatch && currentCategory) {
      const exercise = {
        name: exerciseMatch[1].trim(),
        details: line,
        focus: currentCategory.name,
        duration: parseInt(exerciseMatch[2], 10),
      };
      exercises.push(exercise);
    }
  });

  return exercises;
};



// AI endpoint
router.post("/workout", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a fitness coach." },
        {
          role: "user",
          content: `Generate a workout plan based on this input: ${prompt}.
                    Format the response exactly like this:
    
                    Category (Duration in minutes):
                    - Exercise name: Details
                    - Exercise name: Details
    
                    Example:
                    Warm-up (10):
                    - Jogging: 5 minutes of jogging to get the heart rate up
                    - Dynamic stretches: Focus on lower body mobility
    
                    Strength Training (20):
                    - Push-ups: 3 sets of 12 reps
                    - Squats: 3 sets of 15 reps
                    
                    Separate categories clearly, use newlines for better readability.`,
        },
      ],
      max_tokens: 300, // Increase the token limit for detailed responses
    });    

    const aiWorkoutPlan = aiResponse.choices[0].message.content;
    console.log("Raw AI Response:", aiWorkoutPlan);

    // Parse exercises from AI response
    const exercises = parseExercises(aiWorkoutPlan);
    console.log("Parsed Exercises:", exercises);


    // Send structured data back to frontend
    res.json({
      name: "AI-Generated Plan",
      description: aiWorkoutPlan,
      exercises,
    });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    res.status(500).json({ error: "Failed to generate workout plan" });
  }
});

module.exports = router;
