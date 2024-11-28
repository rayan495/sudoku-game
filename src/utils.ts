// utils.ts

// Helper function to check if placing `num` in the given position is safe
function isSafe(board: number[][], row: number, col: number, num: number): boolean {
    // Check if the number is in the current row
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) {
        return false;
      }
    }
  
    // Check if the number is in the current column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) {
        return false;
      }
    }
  
    // Check if the number is in the current 3x3 subgrid
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) {
          return false;
        }
      }
    }
  
    return true;
  }
  
  // Backtracking function to solve the Sudoku puzzle
  export function solve(board: number[][]): number[][] {
    // Try to find an empty space (denoted by 0)
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {  // If the cell is empty
          for (let num = 1; num <= 9; num++) {  // Try numbers 1-9
            if (isSafe(board, row, col, num)) {
              board[row][col] = num;  // Place the number
              if (solve(board)) {
                return board;  // If it works, return the board
              }
              board[row][col] = 0;  // Backtrack if no valid number was found
            }
          }
          return board;  // No valid number can be placed here, return
        }
      }
    }
    return board;  // Puzzle is solved, return the completed board
  }
  