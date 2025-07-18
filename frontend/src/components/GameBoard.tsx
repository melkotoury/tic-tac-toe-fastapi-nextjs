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
        <div
          key={index}
          className={`w-24 h-24 bg-gray-200 flex items-center justify-center text-4xl font-bold cursor-pointer ${winningCells.includes(index) ? 'bg-green-300' : ''}`}
          onClick={() => onCellClick(index)}
        >
          {cell}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;