import React, { useState } from "react";
import Tesseract from "tesseract.js";
import ImageUpload from "./ImageUpload";
import { useNavigate } from 'react-router-dom';
import "./styles.css";

const processOCRDataWithBboxes = (image: File): Promise<number[][]> => {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(
      image,
      'eng',
      {
        logger: (m) => console.log(m), // Logger to track progress
      }
    ).then(({ data: { text } }) => {
      console.log('OCR Output:', text);

      // Step 1: Clean the OCR text by removing unwanted characters
      let cleanedText = text.replace(/[\|\[\]ff\/\s\(\)\|\-]/g, ''); // Remove unwanted symbols and spaces
      cleanedText = cleanedText.replace(/(\d)(?=\d)/g, '$1 '); // Split multi-digit numbers into individual digits

      console.log('Cleaned Text:', cleanedText); // Log the cleaned text for debugging

      // Step 2: Remove anything other than digits (0-9) and keep only valid numbers
      cleanedText = cleanedText.replace(/[^0-9]/g, ''); 

      // Step 3: Ensure the cleaned text contains exactly 81 digits (if not, pad with '0')
      if (cleanedText.length < 81) {
        cleanedText = cleanedText.padEnd(81, '0'); // Pad with zeros for missing cells
      } else if (cleanedText.length > 81) {
        cleanedText = cleanedText.slice(0, 81); // Slice to ensure we only have 81 digits
      }

      // Step 4: Convert the cleaned text into an array of numbers
      const numbers = Array.from(cleanedText).map(digit => parseInt(digit, 10));

      // Step 5: Convert the array of numbers into a 9x9 Sudoku board
      const board: number[][] = [];
      for (let i = 0; i < 9; i++) {
        board.push(numbers.slice(i * 9, (i + 1) * 9));
      }

      console.log('Processed Sudoku Board:', board); // Log the final Sudoku board
      resolve(board);
    }).catch((error) => {
      console.error('Error processing the image:', error);
      reject(error);
    });
  });
};


// Backtracking algorithm to solve the Sudoku puzzle
const solveSudokuBacktracking = (board: number[][]): number[][] => {
  const findEmpty = (board: number[][]) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return [-1, -1]; // No empty cell found
  };

  const isValid = (board: number[][], row: number, col: number, num: number) => {
    // Check row and column
    for (let c = 0; c < 9; c++) {
      if (board[row][c] === num) return false;
    }
    for (let r = 0; r < 9; r++) {
      if (board[r][col] === num) return false;
    }

    // Check 3x3 grid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (board[r][c] === num) return false;
      }
    }
    return true;
  };

  const backtrack = (board: number[][]): boolean => {
    const [row, col] = findEmpty(board);
    if (row === -1 && col === -1) {
      return true;
    }

    for (let num = 1; num <= 9; num++) {
      if (isValid(board, row, col, num)) {
        board[row][col] = num;
        if (backtrack(board)) {
          return true;
        }
        board[row][col] = 0; // Backtrack
      }
    }
    return false;
  };

  const solvedBoard = [...board];
  backtrack(solvedBoard);
  return solvedBoard;
};

const SudokuSolver: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [board, setBoard] = useState<number[][] | null>(null);
  const [solvedBoard, setSolvedBoard] = useState<number[][] | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setImage(file);
    setOcrError(null);  // Reset previous errors
    try {
      console.log('Starting OCR processing...'); 
      const board = await processOCRDataWithBboxes(file); // Await the result of the async function
      console.log('OCR processing completed. Board data:', board); // Log the OCR result (board)

  
      // Check if the board is valid
      if (board.every((row: number[]) => row.every((cell: number) => cell === 0))) {
        setOcrError("No valid numbers detected in the image. Please try another image.");
      } else {
        setBoard(board);
        setSolvedBoard(null);  // Reset solved board on new upload
      }
    } catch (error) {
      setOcrError("Failed to process the image. Please try another one.");
      console.error(error);
    }
  };

  const handleSolve = () => {
    if (board) {
      const solved = solveSudokuBacktracking(board);
      setSolvedBoard(solved);
    }
  };

  const renderBoard = (board: number[][] | null) => {
    if (!board) return null;

    return (
      <div className="sudoku-board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`sudoku-cell ${cell !== 0 ? "filled" : ""}`}
              >
                {cell !== 0 ? (
                  <span>{cell}</span>
                ) : (
                  <input type="number" value={cell || ""} readOnly={true} />
                )}
              </div>
            );
          })
        )}
      </div>
    );
  };

  return (
    <div>
      
      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files![0])} />
      {ocrError && <p>{ocrError}</p>}
      <div>
        <h3>Detected Board</h3>
        {renderBoard(board)}
      </div>
      <button className="btnn1" onClick={handleSolve} disabled={!board}>
        Solve Sudoku
      </button>
      <div>
        <h3>Solved Board</h3>
        {renderBoard(solvedBoard)}
      </div>
    </div>
  );
};

export default SudokuSolver;

