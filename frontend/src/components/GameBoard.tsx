import React from 'react';

interface GameBoardProps {
  board: string[];
  onCellClick: (index: number) => void;
  winningCells: number[];
}

const GameBoard: React.FC<GameBoardProps> = ({ board, onCellClick, winningCells }) => {
  return (
    <div className="parent relative w-[600px] h-[600px] bg-gray-800 mx-auto rounded-lg border-4 border-gray-800">
      {board.map((cell, index) => (
        <button
          key={`cell-${index}`}
          className={`cell absolute w-[194px] h-[194px] bg-white border border-gray-800 text-7xl font-bold cursor-pointer flex items-center justify-center transition-all duration-300
            ${winningCells.includes(index) ? 'winning bg-green-300 animate-pulse' : ''}
            ${cell === '' ? 'hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50' : ''}
            ${index === 0 ? 'top-[2px] left-[2px]' : ''}
            ${index === 1 ? 'top-[2px] left-[202px]' : ''}
            ${index === 2 ? 'top-[2px] left-[402px]' : ''}
            ${index === 3 ? 'top-[202px] left-[2px]' : ''}
            ${index === 4 ? 'top-[202px] left-[202px]' : ''}
            ${index === 5 ? 'top-[202px] left-[402px]' : ''}
            ${index === 6 ? 'top-[402px] left-[2px]' : ''}
            ${index === 7 ? 'top-[402px] left-[202px]' : ''}
            ${index === 8 ? 'top-[402px] left-[402px]' : ''}
          `}
          onClick={() => onCellClick(index)}
          aria-label={`Cell ${index + 1}: ${cell === '' ? 'empty' : cell}`}
          disabled={cell !== ''}
        >
          {cell}
        </button>
      ))}
    </div>
  );
};

export default GameBoard;