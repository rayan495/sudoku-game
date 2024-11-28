/*import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Sudoku Game</h1>
      
      <Link to="/sudoku">
        <button>Start</button>
      </Link>
    </div>
  );
};
export default HomePage;*/

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GameExplanationModal from './GameExplanationModal';


const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <div>
      <h1 className="title">
        Sudoku Solver <span>Game</span>
      </h1>
      <div>

        {/* Button to navigate to the SudokuBoard page */}
        <Link to="/sudoku-board">
          <button  className="btn2">Start</button>
        </Link>
      </div>
      <div>


        {/* Button to navigate to the SudokuSolver page */}
        <Link to="/sudoku-solver">
          <button className="btn3">Upload Sudoku</button>
        </Link>
      </div>
      <div>

      <button onClick={openModal} className="btn4">How the Game Works</button>
      </div>
      <GameExplanationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
    
  );
};

export default HomePage;
