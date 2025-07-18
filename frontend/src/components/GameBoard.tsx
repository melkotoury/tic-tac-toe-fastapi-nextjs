import React, { useState, useEffect, useCallback } from 'react';

interface GameBoardProps {
  board: string[];
  onCellClick: (index: number) => void;
  winningCells: number[];
  winningCombo: number[] | null;
}

interface WinningLineStyle {
  width: string;
  height: string;
  left: string;
  top: string;
  transform?: string;
  transformOrigin?: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, onCellClick, winningCells, winningCombo }) => {
  const [winningLineStyle, setWinningLineStyle] = useState<WinningLineStyle | null>(null);

  const drawWinningLine = useCallback((combo: number[]) => {
    const lineThickness = 8;
    const boardOffset = 2; // Corresponds to the border of the game board

    const isRowWin = (c: number[]) => (c[0] === 0 && c[1] === 1 && c[2] === 2) || (c[0] === 3 && c[1] === 4 && c[2] === 5) || (c[0] === 6 && c[1] === 7 && c[2] === 8);
    const isColumnWin = (c: number[]) => (c[0] === 0 && c[1] === 3 && c[2] === 6) || (c[0] === 1 && c[1] === 4 && c[2] === 7) || (c[0] === 2 && c[1] === 5 && c[2] === 8);
    const isDiagonalWin = (c: number[]) => (c[0] === 0 && c[1] === 4 && c[2] === 8) || (c[0] === 2 && c[1] === 4 && c[2] === 6);

    let style: WinningLineStyle = {
      width: '',
      height: '',
      left: '',
      top: '',
    };

    if (isRowWin(combo)) {
      const rowPositions: { [key: number]: number } = { 0: 97, 3: 297, 6: 497 };
      style = {
        width: '596px',
        height: `${lineThickness}px`,
        left: `${boardOffset}px`,
        top: `${rowPositions[combo[0]] + boardOffset}px`,
      };
    } else if (isColumnWin(combo)) {
      const columnPositions: { [key: number]: number } = { 0: 97, 1: 297, 2: 497 };
      style = {
        width: `${lineThickness}px`,
        height: '596px',
        left: `${columnPositions[combo[0]] + boardOffset}px`,
        top: `${boardOffset}px`,
      };
    } else if (isDiagonalWin(combo)) {
      style = {
        width: `${lineThickness}px`,
        height: '842px',
        left: '298px',
        top: '-121px',
        transformOrigin: 'center',
      };
      if (combo[0] === 0 && combo[1] === 4 && combo[2] === 8) {
        style.transform = 'rotate(45deg)';
      } else if (combo[0] === 2 && combo[1] === 4 && combo[2] === 6) {
        style.transform = 'rotate(-45deg)';
      }
    }
    setWinningLineStyle(style);
  }, []);

  useEffect(() => {
    if (winningCombo) {
      drawWinningLine(winningCombo);
    } else {
      setWinningLineStyle(null);
    }
  }, [winningCombo, drawWinningLine]);

  return (
    <div className="parent relative w-[600px] h-[600px] bg-gray-800 mx-auto rounded-lg border-4 border-gray-800">
      {board.map((cell, index) => (
        <button
          key={`cell-${index}`}
          className={`cell absolute w-[194px] h-[194px] bg-white border border-gray-800 text-7xl font-bold cursor-pointer flex items-center justify-center transition-all duration-300
            ${winningCells.includes(index) ? 'winning bg-green-300 animate-pulse' : ''}
            ${cell === '' ? 'hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50' : ''}
            ${`cell-${index}`}
          `}
          onClick={() => onCellClick(index)}
          aria-label={`Cell ${index + 1}: ${cell === '' ? 'empty' : cell}`}
          disabled={cell !== ''}
        >
          {cell}
        </button>
      ))}
      {winningLineStyle && <div className="winning-line" style={winningLineStyle}></div>}
    </div>
  );
};

export default GameBoard;