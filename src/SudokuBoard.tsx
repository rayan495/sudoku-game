import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SudokuBoard.css';


      // Define the type for the board state, each cell can be a number or null
      type BoardState = (string | null)[];

      // Type for each Tile component's props
      interface TileProps {
        value: string | null;
        onChange: (newValue: string) => void;
        isEditable: boolean;
        isStartingTile: boolean;
        status: string;
        isDuplicate: boolean;
        id: string;
        isBottomBorder: boolean;
        isRightBorder: boolean;
      }

      // Tile Component
      const Tile: React.FC<TileProps> = ({ value, onChange, isEditable, isStartingTile, id, status, isDuplicate, isBottomBorder, isRightBorder }) => {
        const getTileClass = () => {
          if (status === 'correct') {
            return 'tile-correct';
          } else if (status === 'incorrect') {
            return 'tile-incorrect';
          } else if (isDuplicate) {
            return 'tile-duplicate'; // Add duplicate class
          }
          return '';
        };
      
        // Handle change in the tile input
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
      
          // Only allow numbers between 1 and 9
          if (/^[1-9]$/.test(newValue) || newValue === '') {
            onChange(newValue); // Update the board with the new value
          }
        };
      
        // Build the CSS class dynamically
        const tileClassNames = [
          'tile',
          getTileClass(),
          isStartingTile ? 'tile-start' : '',
          isEditable ? '' : 'tile-locked',
          status === 'correct' ? 'tile-correct-temp' : '',
          isBottomBorder ? 'tile-bottom-border' : '',
          isRightBorder ? 'tile-right-border' : ''
        ]
          .filter(Boolean)
          .join(' ');
      
        return (
          <div className={tileClassNames} id={id}>
            <input
              type="text"
              maxLength={1}
              value={value || ''}
              onChange={handleInputChange}  // Handle manual input
              disabled={!isEditable}  // Disable if it's not an editable tile
              className="tile-input"
            />
          </div>
        );
      };
      
        // Define the solution for validation (static solution for validation)
        const solution: string[][] = [
          ['3', '8', '7', '4', '9', '1', '6', '2', '5'],
          ['2', '4', '1', '5', '6', '8', '3', '7', '9'],
          ['5', '6', '9', '3', '2', '7', '4', '1', '8'],
          ['7', '5', '8', '6', '1', '9', '2', '3', '4'],
          ['1', '2', '3', '7', '8', '4', '5', '9', '6'],
          ['4', '9', '6', '2', '5', '3', '1', '8', '7'],
          ['9', '3', '4', '1', '7', '6', '8', '5', '2'],
          ['6', '7', '5', '8', '3', '2', '9', '4', '1'],
          ['8', '1', '2', '9', '4', '5', '7', '6', '3']
        ];
        
         
        const SudokuBoard: React.FC = () => {
        const navigate = useNavigate();  // Hook to programmatically navigate

        const goToHome = () => {
          navigate('/');  // Navigate to Home page
        };

        const [difficulty, setDifficulty] = useState<string>('easy'); 

        // Initialize state for the board, tile statuses, and error count
        const [board, setBoard] = useState<any>([
          ['-', '-', '-', '4', '9', '1', '6', '2', '5'],
          ['2', '4', '1', '-', '6', '8', '3', '7', '9'],
          ['5', '6', '-', '3', '2', '7', '4', '1', '8'],
          ['7', '5', '8', '6', '-', '9', '2', '3', '4'],
          ['1', '-', '3', '7', '8', '4', '5', '9', '6'],
          ['4', '9', '6', '2', '5', '3', '1', '8', '-'],
          ['9', '3', '4', '1', '7', '-', '8', '5', '2'],
          ['6', '7', '5', '8', '3', '2', '-', '4', '1'],
          ['8', '1', '2', '9', '4', '-', '7', '6', '3']
        ]);
        
        const [tileStatus, setTileStatus] = useState<string[][]>(Array(9).fill(Array(9).fill('-')));
        const [errors, setErrors] = useState(0);
        const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
        const [isGameOver, setIsGameOver] = useState(false); // To track if the game is over
        const [showGameOverMessage, setShowGameOverMessage] = useState(false); // To show message only once
        const [remainingHints, setRemainingHints] = useState(5); // Initial number of hints for each level
        const [currentLevel, setCurrentLevel] = useState('easy'); // Track current level
        const [showSuccessMessage, setShowSuccessMessage] = useState(false);
        const [hintsUsed, setHintsUsed] = useState(0); // Track how many hints have been used
        const [showEndOfGamePopup, setShowEndOfGamePopup] = useState(false);
        // Timer state
        const [time, setTime] = useState(0); // Time in seconds
        const [moveCount, setMoveCount] = useState(0); 
        const [isTimerRunning, setIsTimerRunning] = useState(false); // State to track timer running status
        const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
        
        const toggleTimer = () => {
          if (isTimerRunning) {
            // Pause the timer
            if (timerId) {
              clearInterval(timerId);
              setTimerId(null);
            }
          } else {
            // Start the timer
            const id = setInterval(() => {
              setTime((prevTime) => prevTime + 1);
            }, 1000); // Update every second
            setTimerId(id);
          }
          setIsTimerRunning(!isTimerRunning); // Toggle the running state
        };
        const generatePuzzle = (difficulty: string) => {
          const solvedBoard = solveSudoku(board); // Get the solved board
          if (!solvedBoard) {
            console.error("No solution found for the initial board.");
            return;
          }
        
          let emptyCells = 0;
        
          switch (difficulty) {
            case 'easy':
              emptyCells = 30;
              break;
            case 'medium':
              emptyCells = 45;
              break;
            case 'hard':
              emptyCells = 55;
              break;
            default:
              emptyCells = 45; // default to medium
          }
        
          let puzzleBoard = removeCellsFromPuzzle(solvedBoard, emptyCells); // Remove cells to create the puzzle
          while (!solveSudoku(puzzleBoard, true)) {  // Check if multiple solutions exist
            puzzleBoard = removeCellsFromPuzzle(solvedBoard, emptyCells); // Regenerate puzzle
          }
          setBoard(puzzleBoard);  
        };
        
        // Function to remove a specific number of cells to make the puzzle
        const removeCellsFromPuzzle = (solvedBoard: BoardState[], emptyCells: number): BoardState[] => {
          let puzzleBoard = [...solvedBoard];
          let cellsToRemove = emptyCells;
        
          while (cellsToRemove > 0) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
        
            // Make sure the cell is not already empty
            if (puzzleBoard[row][col] !== '-') {
              puzzleBoard[row][col] = '-';
              cellsToRemove--;
            }
          }
        
          return puzzleBoard;
        };

        // Inside useEffect, trigger the puzzle generation when difficulty changes
        useEffect(() => {
          generatePuzzle(difficulty);
       }, [difficulty]); // Re-generate puzzle when difficulty changes

       // Handle changing difficulty on "Next" button click
        const handleNextLevel = () => {
 
       // Reset all game-related states
        setIsPuzzleComplete(false); // Hide the success message
        setTime(0); // Reset the timer
        setMoveCount(0); // Reset the move count
        setRemainingHints(5); // Reset the number of hints
        setErrors(0); // Reset errors count
        setHintsUsed(0); // Reset the hints used counter
        setTileStatus(Array(9).fill(Array(9).fill(''))); // Reset tile status

      const levels = ['easy', 'medium', 'hard'];
      const nextLevelIndex = (levels.indexOf(difficulty) + 1) % levels.length;
      setDifficulty(levels[nextLevelIndex]);
      setShowSuccessMessage(false); 
    };

      const handleRestart = () => {
        resetPuzzle();
        setShowSuccessMessage(false); // Hide the success message
        setIsPuzzleComplete(false);  // Ensure puzzle is not marked complete
        setErrors(0);  // Reset errors if necessary
        setRemainingHints(5);  // Optionally reset hints
        setTileStatus(Array(9).fill(Array(9).fill(''))); 
        setTime(0);
        setMoveCount(0);
        setHintsUsed(0); 
        setIsTimerRunning(false); // Stop timer
    };
        const solvePuzzle = () => {
          const solvedBoard = solveSudoku(board); // Get the solved board
          setBoard(solvedBoard); // Update the board with the solved values
          setTileStatus(Array(9).fill(Array(9).fill(''))); // Reset tile status
          
        };
      
        // Handle the change in value for the tile
        const handleTileChange = (row: number, col: number, newValue: string) => {
          if (isGameOver) return; // Prevent any interaction if the game is over
          const updatedBoard = [...board];
          updatedBoard[row][col] = newValue;
          setBoard(updatedBoard);
          setMoveCount((prev) => prev + 1);
          const isCorrect = solution[row][col] === newValue;
          const updatedStatus = [...tileStatus];
          updatedStatus[row][col] = isCorrect ? 'correct' : 'incorrect';
          setTileStatus(updatedStatus);
      
          if (isCorrect) {
            // Apply the green effect for 3 seconds
            setTimeout(() => {
              const resetStatus = [...tileStatus];
              resetStatus[row][col] = ''; // Reset the green effect
              setTileStatus(resetStatus);
            }, 3000); // Green disappears after 3 seconds
          } else {
            setErrors((prevErrors) => prevErrors + 1);
      
            // Reset the incorrect tile (number and background) after 3 seconds
            setTimeout(() => {
              const resetStatus = [...tileStatus];
              resetStatus[row][col] = ''; // Remove red background
              updatedBoard[row][col] = '-'; // Reset incorrect value
              setBoard(updatedBoard);
              setTileStatus(resetStatus); // Clear the incorrect status
            }, 3000);
          }
      
          validateBoard(updatedBoard);
          checkPuzzleCompletion(updatedBoard);
          setMoveCount(prevMoveCount => prevMoveCount + 1); // Increment move counter
        };

        // Save game to localStorage
        const saveGame = () => {
            const gameState = {
                board,
                moveCount,
                tileStatus,
                time,
                isTimerRunning,
                errors,
                hintsUsed,
                remainingHints,
      };

    localStorage.setItem("savedGame", JSON.stringify(gameState)); // Save the game state
    alert("Game saved!");

    // Reset the board after saving the game
    resetPuzzle();
    setShowSuccessMessage(false); // Hide the success message
    setIsPuzzleComplete(false);  // Ensure puzzle is not marked complete
    setErrors(0);  // Reset errors if necessary
    setRemainingHints(5);  // Optionally reset hints
    setTileStatus(Array(9).fill(Array(9).fill(''))); 
    setTime(0);
    setRemainingHints(5);
    setIsTimerRunning(false);
    setMoveCount(0); // Reset move count
    setTileStatus(Array(9).fill(Array(9).fill(''))); 
    if (timerId) {
      clearInterval(timerId); // Clear the timer if it was running
    }
  };
  
  // Load game from localStorage
  const loadGame = () => {
    const savedGame = localStorage.getItem("savedGame");
    
    if (savedGame) {
      const gameState = JSON.parse(savedGame);
      setBoard(gameState.board);
      setMoveCount(gameState.moveCount);
      setTileStatus(gameState.tileStatus);
      setTime(gameState.time);
      setIsTimerRunning(gameState.isTimerRunning);
      setErrors(gameState.errors);
      setHintsUsed(gameState.hintsUsed);
      setRemainingHints(5 - gameState.hintsUsed);
      alert("Game loaded!");
    } else {
      alert("No saved game found!");
    }
  };

        useEffect(() => {
          return () => {
            if (timerId) {
              clearInterval(timerId); // Cleanup timer on component unmount
            }
          };
        }, [timerId]); 

        const handleStartTimer = () => {
          setIsTimerRunning(true); // Start the timer when the button is clicked
        };
        // Validate the board for duplicates
        const validateBoard = (updatedBoard: BoardState[]) => {
          const updatedStatus = [...tileStatus];
          const duplicateStatuses: boolean[][] = Array(9).fill(Array(9).fill(false));
      
          for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
              const value = updatedBoard[r][c];
              if (value === '-') continue;
      
              // Check duplicates in the same row
              for (let i = 0; i < 9; i++) {
                if (i !== c && updatedBoard[r][i] === value) {
                  duplicateStatuses[r][c] = true;
                  updatedStatus[r][c] = 'duplicate';
                }
              }
      
              // Check duplicates in the same column
              for (let i = 0; i < 9; i++) {
                if (i !== r && updatedBoard[i][c] === value) {
                  duplicateStatuses[r][c] = true;
                  updatedStatus[r][c] = 'duplicate';
                }
              }
      
              // Check duplicates in the same 3x3 grid
              const startRow = Math.floor(r / 3) * 3;
              const startCol = Math.floor(c / 3) * 3;
              for (let i = startRow; i < startRow + 3; i++) {
                for (let j = startCol; j < startCol + 3; j++) {
                  if (i !== r || j !== c) {
                    if (updatedBoard[i][j] === value) {
                      duplicateStatuses[r][c] = true;
                      updatedStatus[r][c] = 'duplicate';
                    }
                  }
                }
              }
            }
          }
      
          setTileStatus(updatedStatus);
      
          // Reset duplicate background after 3 seconds
          setTimeout(() => {
            const resetStatus = [...updatedStatus];
            for (let r = 0; r < 9; r++) {
              for (let c = 0; c < 9; c++) {
                if (duplicateStatuses[r][c]) {
                  resetStatus[r][c] = ''; // Remove duplicate status
                }
              }
            }
            setTileStatus(resetStatus);
          }, 3000);
        };
      
        
          const checkPuzzleCompletion = (updatedBoard: BoardState[]) => {
          let completed = true;
          for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
              if (updatedBoard[r][c] !== solution[r][c]) {
                completed = false;
                break;
              }
            }
            if (!completed) break;
          }
        
          setIsPuzzleComplete(completed);
        
          if (completed) {
              // Hide the popup after 3 seconds
              setTimeout(() => {
                setShowEndOfGamePopup(false);
              }, 5000);
            
              if (timerId) {
                clearInterval(timerId);
                setTimerId(null); // Ensure the timer is cleared
              }
              setIsTimerRunning(false);
            setShowSuccessMessage(true); // Show success message when puzzle is complete
          }
        };
      
        // Reset the puzzle state (board, errors, tile statuses)
        const resetPuzzle = () => {
          generatePuzzle(difficulty);
          setTileStatus(Array(9).fill(Array(9).fill('')));
          setErrors(0);
          setIsPuzzleComplete(false);
          setIsGameOver(false); // Allow the game to be played again
          setShowGameOverMessage(false); // Hide the game over message
          setTime(0); // Reset the timer
          setMoveCount(0); // Reset move counter
          setRemainingHints(5);
        };
        
      
        useEffect(() => {
          if(errors >= 10 && !isGameOver){
            setIsGameOver(true);
            setShowGameOverMessage(true);
            setTimeout(() => {
              resetPuzzle();
            }, 5000);

            setTimeout(() => {
              setShowGameOverMessage(false);
            }, 5000);
          }
        }, [errors, isGameOver]);
        
        const renderBoard = () => {
          const tiles: JSX.Element[] = [];
          for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
              const tileId = `${r}-${c}`;
              const isStartingTile = solution[r][c] === board[r][c];
              const isEditable = board[r][c] === '-';
              const isDuplicate = tileStatus[r][c] === 'duplicate';
      
              const isBottomBorder = r === 2 || r === 5;
              const isRightBorder = c === 2 || c === 5;
      
              tiles.push(
                <Tile
                  key={tileId}
                  value={board[r][c] === '-' ? '' : board[r][c]}
                  onChange={(newValue) => handleTileChange(r, c, newValue)}
                  isEditable={isEditable}
                  isStartingTile={isStartingTile}
                  id={tileId}
                  status={tileStatus[r][c]}
                  isDuplicate={isDuplicate}
                  isBottomBorder={isBottomBorder}
                  isRightBorder={isRightBorder}
                />
              );
            }
          }
          return tiles;
        };
      
        useEffect(() => {
          if (isPuzzleComplete) {
            // Animation will be triggered once puzzle is complete
            const successMessageElement = document.getElementById('success-message');
            if (successMessageElement) {
              successMessageElement.style.opacity = '1';  // Make it visible
              successMessageElement.style.transform = 'scale(1)';  // Reset the scale to normal
            }
          }
        }, [isPuzzleComplete]);

        const giveHint = () => {
          if (remainingHints > 0) {
            // Find an empty tile (i.e., a cell with value '-')
            const emptyTiles: { row: number, col: number }[] = [];
            for (let r = 0; r < 9; r++) {
              for (let c = 0; c < 9; c++) {
                if (board[r][c] === '-') {
                  emptyTiles.push({ row: r, col: c });
                }
              }
            }
      
            if (emptyTiles.length > 0) {
              // Randomly pick an empty tile
              const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
              const { row, col } = randomTile;
      
              // Set the hint number and status
              const updatedBoard = [...board];
              updatedBoard[row][col] = solution[row][col]; // Reveal the correct number
      
              // Update the hint status (apply the green effect)
              const updatedStatus = [...tileStatus];
              updatedStatus[row][col] = 'correct'; // Mark as correct for styling
      
              setBoard(updatedBoard);
              setTileStatus(updatedStatus);
      
      
              // Decrease the remaining hints
              setRemainingHints((prev) => prev - 1);
              setHintsUsed((prev) => prev + 1); // Increment hints used
      
            }
          }
        };

        const nextLevel = () => {
          // Reset the hints to 5
          setRemainingHints(5);
      
          // You can also reset the board for the next level or set it to the next level board
          // For example, you could load a new board or puzzle based on the current level
          setCurrentLevel((prevLevel) => prevLevel + 1); };

          useEffect(() => {
            // Check if the game is won and auto-advance to next level, for example:
            if (isPuzzleComplete) {
              nextLevel();
            }
          }, [isPuzzleComplete]);
          useEffect(() => {
            console.log('Hints Used:', hintsUsed); // This will reflect the correct state after every update.
          }, [hintsUsed]);
          const renderSuccessMessage = () => {
            if (!isPuzzleComplete) return null; // Only show the success message if the puzzle is complete
          
            return (
              <div id="success-message" className="success-message">
                <h2>Congratulations! Puzzle Solved!</h2>
                <p>Errors Made: {errors}</p>
                <p>Time Taken: {time}</p>
                <p>Hints Used: {hintsUsed}</p>  {/* Should correctly reflect the value */}
                <div>
                  <button onClick={handleNextLevel}>Next Level</button>
                  <button onClick={handleRestart}>Restart</button>
                  </div>
                
              </div>
            )};
        
            
            const formatTime = (totalSeconds: number) => {
              const minutes = Math.floor(totalSeconds / 60);
              const seconds = totalSeconds % 60;
              return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
            };
          
        return (
          <div className="sudoku-container">
            
            <div>
            <h3 className="title2"> {difficulty} Level</h3>
            </div>
            <div className="full-width-border"></div>

                {renderSuccessMessage ()}

            {showGameOverMessage && (
              <div id="game-over-popup" className="game-over-popup">
                <div className="game-over-content">
                  <h2>Game Over</h2>
                  <p>You have reached 10 errors. The game will reset now.</p>
                </div>
              </div>
            )}
            <div id="errors">Errors: {errors}</div>
            <div id="move-count">Moves: {moveCount}</div>
            <div id="timer">Time: {time}s</div>
            <div id="board" className="board-container">
              {renderBoard()}
            </div>
            <button className="btn11" onClick={resetPuzzle}>
              {isGameOver ? "Try Again" : "Reset Puzzle"}
            </button>
            <button className="btn10" onClick={solvePuzzle}>Solve Puzzle</button>
            <div>
            <button className="btn7" onClick={giveHint} disabled={remainingHints <= 0}>
              Get Hint ({remainingHints})
            </button>
            <button  className="btn8" onClick={saveGame}>Save Game</button>
            <button className="btn9" onClick={loadGame}>Load Game</button>
            <button onClick={goToHome} className="btn6">Home Page</button>
            <button className="btn5" onClick={toggleTimer}>
                    {isTimerRunning ? "Pause Timer" : "Start Timer"}
            </button>
        </div>
      </div> );};
          
const solveSudoku = (board: BoardState[], findMultiple: boolean = false): BoardState[] | null  => {
        
  const solvedBoard = JSON.parse(JSON.stringify(board));
  // Helper function to check if the current number is valid
  const isValid = (board: BoardState[], row: number, col: number, num: string): boolean => {
    // Check the row
    for (let c = 0; c < 9; c++) {
      if (board[row][c] === num) {
        return false;
      }
    }

    // Check the column
    for (let r = 0; r < 9; r++) {
      if (board[r][col] === num) {
        return false;
      }
    }

    // Check the 3x3 subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (board[r][c] === num) {
          return false;
        }
      }
    }
    return true;
  };

  // Helper function to solve the board
  const solve = (board: BoardState[]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === '-') { // If the cell is empty
          for (let num = 1; num <= 9; num++) {
            const numStr = num.toString();
            if (isValid(board, row, col, numStr)) {
              board[row][col] = numStr; // Place the number
              const result = solve(board);
              if (result) {
                return true; // Recursively solve the next cells
              }
              board[row][col] = '-'; // Backtrack
            }
          }
          return false; // No valid number found, trigger backtracking
        }
      }
    }
    
return true; 
  };

  if (solve(solvedBoard)) {
    return solvedBoard;  // Return the solved board
  } else {
    return null;  // No solution found
  }
};

export default SudokuBoard;