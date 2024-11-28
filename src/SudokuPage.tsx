import React from 'react';
import SudokuBoard from './SudokuBoard';

const SudokuPage: React.FC = () => {
  return (
    <div className="sudoku-page">
      <header>
        <h1>Welcome to Sudoku!</h1>
      </header>
      <main>
        <SudokuBoard />
      </main>
    </div>
  );
}

export default SudokuPage;
