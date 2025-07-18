import React from 'react';

interface GameBoardProps {
  board: string[];
  onCellClick: (index: number) => void;
  winningCells: number[];
}

const GameBoard: React.FC<GameBoardProps> = ({ board, onCellClick, winningCells }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-8">
      {board.map((cell, index) => (
        <button
          key={`cell-${index}`}
          className={`w-24 h-24 bg-gray-200 flex items-center justify-center text-4xl font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${winningCells.includes(index) ? 'bg-green-300' : ''}`}
          onClick={() => onCellClick(index)}
          aria-label={`Cell ${index + 1}: ${cell === '' ? 'empty' : cell}`}
        >
          {cell}
        </button>
      ))}
    </div>
  );
};

export default GameBoard;
