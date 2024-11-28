// App.tsx
/*import React from 'react';
import SudokuBoard from './SudokuBoard';
import SudokuSolver from "./SudokuSolver";  // Import SudokuSolver


const App: React.FC = () => {
  return (
    <div>
      <h1>Sudoku Image Solver</h1>
      <SudokuSolver />  
  </div>
  
  );
};

export default App;*/
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




// src/App.tsx
/*import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./HomePage";
import SudokuBoard from "./SudokuBoard";
import ChooseLevel from "./ChooseLevel";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/sudoku-board" component={SudokuBoard} />
        <Route path="/choose-level" component={ChooseLevel} />
      </Switch>
    </Router>
  );
};

export default App;*/

/*import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SudokuPage from './SudokuPage';


const App: React.FC = () => {
  return (
      
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sudoku" element={<SudokuPage />} />
      </Routes>
    </Router>
  );
}




export default App;*/

/*import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SudokuPage from './SudokuPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sudoku" element={<SudokuPage />} />
      </Routes>
    </Router>
  );
};

export default App;*/





