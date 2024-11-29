import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import SudokuBoard from './SudokuBoard';
import SudokuSolver from './SudokuSolver';  // Import SudokuSolver

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Define Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/sudoku-board" element={<SudokuBoard />} />
          <Route path="/sudoku-solver" element={<SudokuSolver />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;





