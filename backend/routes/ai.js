const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// Initialize OpenAI client
const openai = new OpenAI({
 // apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to parse exercises from AI response
const parseExercises = (description) => {
  const exercises = [];
  const sections = description.split("\n"); // Split by newlines

  let currentCategory = null;

  sections.forEach((line) => {
    // Match categories like "Warm-up (10 minutes):"
    const categoryMatch = line.match(/^(.+?)\s\((\d+)\sminutes?\):$/);
    if (categoryMatch) {
      currentCategory = {
        name: categoryMatch[1].trim(),
        duration: parseInt(categoryMatch[2], 10),
        exercises: [],
      };
      exercises.push(currentCategory); // Add category to exercises
    }

    // Match exercises like "- Jogging in place: 3 minutes"
    const exerciseMatch = line.match(/-\s(.+?):\s(\d+)\sminutes?/);
    if (exerciseMatch && currentCategory) {
      currentCategory.exercises.push({
        name: exerciseMatch[1].trim(),
        focus: currentCategory.name, // Use category name as the focus
        duration: parseInt(exerciseMatch[2], 10),
      });
    }
  });

  // Flatten categories and their exercises into a single array
  return exercises.flatMap((category) => category.exercises);
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
          content: `Generate a workout plan based on this input: ${prompt}`,
        },
      ],
      max_tokens: 100, // Allow more detailed responses
    });

    const aiWorkoutPlan = aiResponse.choices[0].message.content;

    // Parse exercises from AI response
    const exercises = parseExercises(aiWorkoutPlan);

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
