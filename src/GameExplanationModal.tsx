import React from 'react';
import './GameExplanationModal.css';  // Add styles for the modal.

interface GameExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameExplanationModal: React.FC<GameExplanationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Only render the modal if it is open.

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="title">How the Game Works</h2>
        <p>
          Welcome to the Sudoku Image Solver! Here's how the game works:
        </p>
        <ul>
          <li><strong className="stp">Step 1:</strong> Click on the "Start" button to begin. You will be taken to the Sudoku page.</li>
          <li><strong className="stp">Step 2:</strong> The game contains three levels: Easy, Medium, and Hard. Each level has a different number of empty cells in the Sudoku grid, with more challenging puzzles having fewer empty cells.</li>
          <li><strong className="stp">Step 3:</strong> You will have 5 hints available per level to help you solve the puzzle.</li>
          <li><strong className="stp">Step 4:</strong> If you need help, you can click the "Solve" button to see the solution to the Sudoku puzzle.</li>
          <li><strong className="stp">Step 5:</strong> You can save your puzzle by clicking the "Save" button, and you can load a previously saved puzzle by clicking "Load".</li>
          <li><strong className="stp">Step 6:</strong> To reset the puzzle, click the "Reset" button, which will return the puzzle to its initial state.</li>
          <li><strong className="stp">Step 7:</strong> The home button will take you back to the home page at any time.</li>
          <li><strong className="stp">Step 8:</strong> If you make 10 errors, the game will automatically reset and start over.</li>
          <li><strong className="stp">Step 9:</strong> When you solve the puzzle correctly, you will see a success message with the following information:
            <ul>
              <li>The number of errors you made during the game.</li>
              <li>The number of hints you used to help solve the puzzle.</li>
              <li>The time you took to complete the puzzle.</li>
              <li>You will have two options: 
                <ul>
                  <li>"Next Level" will take you to the next difficulty level.</li>
                  <li>"Restart" will restart the current puzzle.</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>

        <button className="btn1" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default GameExplanationModal;
