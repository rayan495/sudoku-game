import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // To navigate to another page

const GameComponent: React.FC = () => {
  const [isGameCompleted, setIsGameCompleted] = useState(false); // Track if the game is completed
  const [currentLevel, setCurrentLevel] = useState('hard'); // Assume current level is hard for this example
  const [board, setBoard] = useState([]); // Your game board state
  const [moveCount, setMoveCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [errors, setErrors] = useState(0);
  const [time, setTime] = useState(0);

  const navigate = useNavigate(); // Initialize navigation hook to navigate between pages

  // Handle when the hard level is completed
  const handleLevelComplete = () => {
    if (currentLevel === 'hard') {
      setIsGameCompleted(true); // Set game as completed to show the modal
    }
  };

  useEffect(() => {
    // If the game is completed, automatically navigate to SudokuPage after 2 seconds
    if (isGameCompleted) {
      setTimeout(() => {
        navigate('/sudoku'); // Automatically navigate to the SudokuPage
      }, 2000); // Wait for 2 seconds before redirecting
    }
  }, [isGameCompleted, navigate]);

  return (
    <div>
      {/* Your normal game UI */}
      <h2>Level: {currentLevel}</h2>

      {/* Button to simulate completing the hard level */}
      <button onClick={handleLevelComplete}>Finish Hard Level</button>

      {/* End-of-Game Message */}
      {isGameCompleted && (
        <div className="end-game-message">
          <h2>End of the Game!</h2>
          <p>Congratulations! You've completed the hard level.</p>
        </div>
      )}

      {/* Your other game UI here */}
    </div>
  );
};

export default GameComponent;
