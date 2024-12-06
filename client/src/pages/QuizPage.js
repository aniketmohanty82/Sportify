import React, { useState, useEffect } from 'react';
import '../QuizPage.css'; // Adjust the path as needed
import axios from 'axios';
import athleteData from '../athletes.json'; // Import athletes JSON

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasTakenQuizBefore, setHasTakenQuizBefore] = useState(false);
  const [previousResult, setPreviousResult] = useState(null);
  const [result, setResult] = useState('');
  const [resultDescription, setResultDescription] = useState('');
  const [resultImage, setResultImage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const quizData = [
    {
      id: 1,
      question: "What motivates you to achieve your goals?",
      options: {
        a: "Winning and being the best",
        b: "Overcoming challenges and proving doubters wrong",
        c: "Contributing to a team’s success",
        d: "Mastery of skill and personal growth",
        e: "Pushing physical and mental limits",
      },
    },
    {
      id: 2,
      question: "What is your preferred style of competition?",
      options: {
        a: "High-pressure, big stages",
        b: "Strategic and calculated",
        c: "Fast-paced and exciting",
        d: "Endurance-based and disciplined",
        e: "Technically precise and graceful",
      },
    },
    {
      id: 3,
      question: "How do you handle failure?",
      options: {
        a: "Use it as fuel to dominate the next challenge",
        b: "Analyze and learn from it patiently",
        c: "View it as a minor setback in a larger journey",
        d: "Turn it into a lesson for the whole team",
        e: "Stay calm and focus on what I can control",
      },
    },
    {
      id: 4,
      question: "What is your work ethic like?",
      options: {
        a: "Relentless and driven to perfection",
        b: "Focused and goal-oriented",
        c: "Hard-working and collaborative",
        d: "Creative and inspired",
        e: "Passionate with a flair for the dramatic",
      },
    },
    {
      id: 5,
      question: "What kind of legacy do you want to leave?",
      options: {
        a: "Being remembered as a GOAT in my field",
        b: "Inspiring others through resilience and skill",
        c: "Pioneering new ways to approach my field",
        d: "As a team player who changed the game",
        e: "Consistently delivering excellence",
      },
    },
    {
      id: 6,
      question: "What role does your mindset play in your success?",
      options: {
        a: "Focus and mental toughness are everything",
        b: "Confidence and swagger get the job done",
        c: "Discipline and strategy keep me steady",
        d: "Resilience and creativity drive me",
        e: "Balance and humility make me better",
      },
    },
    {
      id: 7,
      question: "Which environment do you thrive in?",
      options: {
        a: "Large, roaring crowds and bright lights",
        b: "Focused, quiet competition",
        c: "Collaborative and team-driven",
        d: "Balanced between spotlight and solitude",
        e: "Any scenario where I can shine individually",
      },
    },
    {
      id: 8,
      question: "How do you approach training?",
      options: {
        a: "Precision and repetition are key",
        b: "Intensity and pushing boundaries",
        c: "Endurance and consistency",
        d: "Creative and adaptive",
        e: "Hard work and a results-oriented focus",
      },
    },
    {
      id: 9,
      question: "Which characteristic best describes you?",
      options: {
        a: "Determined",
        b: "Inspirational",
        c: "Visionary",
        d: "Strategic",
        e: "Charismatic",
      },
    },
    {
      id: 10,
      question: "What kind of sport excites you the most?",
      options: {
        a: "High-intensity individual competition",
        b: "Tactical and skill-based team sports",
        c: "Strategic endurance challenges",
        d: "Creative and artistic sports",
        e: "Dynamic and fast-paced sports",
      },
    },
  ];

  const weights = {
    1: {
      a: { "Cristiano Ronaldo": 5, "Serena Williams": 4, "Michael Jordan": 4 },
      b: { "Michael Jordan": 5, "Simone Biles": 4 },
      c: { "Lionel Messi": 5, "Tom Brady": 4 },
      d: { "Roger Federer": 5, "Usain Bolt": 4 },
      e: { "Eliud Kipchoge": 5, "LeBron James": 5 },
    },
    2: {
      a: { "Michael Jordan": 5, "Serena Williams": 5, "Usain Bolt": 5 },
      b: { "Lionel Messi": 5, "Tom Brady": 5, "Roger Federer": 4 },
      c: { "Cristiano Ronaldo": 5, "Simone Biles": 5 },
      d: { "Eliud Kipchoge": 5, "LeBron James": 5 },
      e: { "Roger Federer": 5, "Cristiano Ronaldo": 4 },
    },
    3: {
      a: { "Michael Jordan": 5, "Serena Williams": 5 },
      b: { "Lionel Messi": 4, "Roger Federer": 5 },
      c: { "Usain Bolt": 4, "Eliud Kipchoge": 5 },
      d: { "Tom Brady": 5, "LeBron James": 4 },
      e: { "Cristiano Ronaldo": 5, "Simone Biles": 4 },
    },
    4: {
      a: { "Cristiano Ronaldo": 5, "Serena Williams": 5 },
      b: { "Eliud Kipchoge": 5, "Lionel Messi": 4 },
      c: { "Tom Brady": 5, "LeBron James": 4 },
      d: { "Roger Federer": 5, "Simone Biles": 5 },
      e: { "Usain Bolt": 5, "Michael Jordan": 4 },
    },
    5: {
      a: { "Michael Jordan": 5, "Serena Williams": 5 },
      b: { "Usain Bolt": 4, "Simone Biles": 5 },
      c: { "Eliud Kipchoge": 5, "Roger Federer": 5 },
      d: { "LeBron James": 5, "Tom Brady": 5 },
      e: { "Cristiano Ronaldo": 5, "Lionel Messi": 5 },
    },
    6: {
      a: { "Serena Williams": 5, "Eliud Kipchoge": 5 },
      b: { "Cristiano Ronaldo": 5, "Usain Bolt": 4 },
      c: { "Tom Brady": 5, "Roger Federer": 4 },
      d: { "Simone Biles": 5, "Michael Jordan": 5 },
      e: { "LeBron James": 5, "Lionel Messi": 4 },
    },
    7: {
      a: { "Michael Jordan": 5, "Usain Bolt": 5 },
      b: { "Roger Federer": 5, "Eliud Kipchoge": 5 },
      c: { "Tom Brady": 5, "Lionel Messi": 5 },
      d: { "LeBron James": 5, "Simone Biles": 4 },
      e: { "Cristiano Ronaldo": 5, "Serena Williams": 5 },
    },
    8: {
      a: { "Roger Federer": 5, "Lionel Messi": 4 },
      b: { "Serena Williams": 5, "Michael Jordan": 5 },
      c: { "Eliud Kipchoge": 5, "LeBron James": 4 },
      d: { "Simone Biles": 5, "Usain Bolt": 5 },
      e: { "Cristiano Ronaldo": 5, "Tom Brady": 4 },
    },
    9: {
      a: { "Serena Williams": 5, "Cristiano Ronaldo": 4 },
      b: { "Simone Biles": 5, "Eliud Kipchoge": 4 },
      c: { "LeBron James": 5, "Roger Federer": 4 },
      d: { "Lionel Messi": 5, "Tom Brady": 4 },
      e: { "Michael Jordan": 5, "Usain Bolt": 5 },
    },
    10: {
      a: { "Usain Bolt": 5, "Serena Williams": 5 },
      b: { "Lionel Messi": 5, "Tom Brady": 5 },
      c: { "Eliud Kipchoge": 5, "LeBron James": 5 },
      d: { "Simone Biles": 5, "Roger Federer": 5 },
      e: { "Cristiano Ronaldo": 5, "Michael Jordan": 5 },
    },
  };

  const currentQuestion = quizData[currentQuestionIndex];

  useEffect(() => {
    const fetchPreviousResult = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/quiz/result', {
          headers: { 'x-auth-token': token }
        });

        if (response.data && response.data.result) {
          const { result, answers, description, image } = response.data;
          setPreviousResult({ result, description, image });
          setHasTakenQuizBefore(true);
        } else {
          setHasTakenQuizBefore(false);
        }
      } catch (error) {
        console.error('Error fetching previous result:', error);
        setHasTakenQuizBefore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousResult();
  }, []);

  const handleOptionChange = (e) => {
    setAnswers({ ...answers, [currentQuestion.id]: e.target.value });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRetake = () => {
    setIsSubmitted(false);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setHasTakenQuizBefore(false);
    setPreviousResult(null);
  };

  const handleSubmit = async () => {
    const totalScores = {};
    Object.entries(answers).forEach(([questionId, answerKey]) => {
      const questionWeights = weights[questionId];
      const athleteScores = questionWeights[answerKey];
      for (const athlete in athleteScores) {
        totalScores[athlete] = (totalScores[athlete] || 0) + athleteScores[athlete];
      }
    });

    let maxScore = 0;
    let bestAthlete = '';
    for (const athlete in totalScores) {
      if (totalScores[athlete] > maxScore) {
        maxScore = totalScores[athlete];
        bestAthlete = athlete;
      }
    }

    setResult(bestAthlete);
    const athleteInfo = athleteData.find((athlete) => athlete.name === bestAthlete);
    setResultDescription(athleteInfo ? athleteInfo.description : 'Description not found.');
    setResultImage(athleteInfo ? athleteInfo.image : '');
    setIsSubmitted(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5001/api/quiz/logresult',
        { result: bestAthlete, answers },
        { headers: { 'x-auth-token': token } }
      );
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  if (loading) {
    return <div className={`quiz-container ${darkMode ? 'dark-mode' : ''}`}>Loading...</div>;
  }

  // If user has taken quiz before and not retaking yet
  if (hasTakenQuizBefore && previousResult && !isSubmitted) {
    return (
      <div className={`quiz-container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="result-card">
          <h2 className="result-title">Your Previous Result</h2>
          <p className="result-text">
            You are most similar to <strong>{previousResult.result}</strong>!
          </p>
          {previousResult.image && (
            <div className="result-image-container">
              <img
                src={previousResult.image}
                alt={previousResult.result}
                className="result-image"
              />
            </div>
          )}
          <p className="result-description">{previousResult.description}</p>
          <button onClick={handleRetake} className="button retake-button">Retake Quiz</button>
        </div>
      </div>
    );
  }
  

  // If quiz is submitted now (either first time or after retake)
  if (isSubmitted) {
    return (
      <div className={`quiz-container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="result-card">
          <h2 className="result-title">Your Result</h2>
          <p className="result-text">
            You are most similar to <strong>{result}</strong>!
          </p>
          {resultImage && (
            <div className="result-image-container">
              <img
                src={resultImage}
                alt={result}
                className="result-image"
              />
            </div>
          )}
          <p className="result-description">{resultDescription}</p>
          <button onClick={handleRetake} className="button retake-button">Retake Quiz</button>
        </div>
      </div>
    );
  }
  

    return (
    <div className={`quiz-container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="quiz-card">
        <h2 className="quiz-title">Question {currentQuestionIndex + 1} of {quizData.length}</h2>
        <p className="question-text">{currentQuestion.question}</p>
        <form className="options-form">
            {Object.entries(currentQuestion.options).map(([key, option]) => (
            <div key={key} className="option-item">
                <label>
                <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={key}
                    checked={answers[currentQuestion.id] === key}
                    onChange={handleOptionChange}
                />
                {option}
                </label>
            </div>
            ))}
        </form>
        <div className="navigation-buttons">
            {currentQuestionIndex > 0 && (
            <button onClick={handlePreviousQuestion} className="button previous-button">Previous</button>
            )}
            {currentQuestionIndex < quizData.length - 1 && (
            <button
                onClick={handleNextQuestion}
                className="button next-button"
                disabled={!answers[currentQuestion.id]}
            >
                Next
            </button>
            )}
            {currentQuestionIndex === quizData.length - 1 && (
            <button
                onClick={handleSubmit}
                className="button submit-button"
                disabled={!answers[currentQuestion.id]}
            >
                Submit
            </button>
            )}
        </div>
        </div>
    </div>
    );

};

export default QuizPage;
