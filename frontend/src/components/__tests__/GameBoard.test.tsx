import { render, screen, fireEvent } from '@testing-library/react';
import GameBoard from '../GameBoard';
import '@testing-library/jest-dom';

describe('GameBoard', () => {
  const mockOnCellClick = jest.fn();

  beforeEach(() => {
    mockOnCellClick.mockClear();
  });

  it('renders 9 cells', () => {
    const board = Array(9).fill('');
    render(<GameBoard board={board} onCellClick={mockOnCellClick} winningCells={[]} winningCombo={null} />);
    const cells = screen.getAllByRole('button');
    expect(cells).toHaveLength(9);
  });

  it('displays correct cell content', () => {
    const board = ['X', 'O', '', '', '', '', '', '', ''];
    render(<GameBoard board={board} onCellClick={mockOnCellClick} winningCells={[]} winningCombo={null} />);
    expect(screen.getByRole('button', { name: 'Cell 1: X' })).toHaveTextContent('X');
    expect(screen.getByRole('button', { name: 'Cell 2: O' })).toHaveTextContent('O');
    expect(screen.getByRole('button', { name: 'Cell 3: empty' })).toHaveTextContent('');
  });

  it('calls onCellClick when an empty cell is clicked', () => {
    const board = Array(9).fill('');
    render(<GameBoard board={board} onCellClick={mockOnCellClick} winningCells={[]} winningCombo={null} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cell 1: empty' }));
    expect(mockOnCellClick).toHaveBeenCalledTimes(1);
    expect(mockOnCellClick).toHaveBeenCalledWith(0);
  });

  it('does not call onCellClick when a filled cell is clicked', () => {
    const board = ['X', '', '', '', '', '', '', '', ''];
    render(<GameBoard board={board} onCellClick={mockOnCellClick} winningCells={[]} winningCombo={null} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cell 1: X' }));
    expect(mockOnCellClick).not.toHaveBeenCalled();
  });

  it('applies winning class to winning cells', () => {
    const board = ['X', 'X', 'X', '', '', '', '', '', ''];
    const winningCells = [0, 1, 2];
    render(<GameBoard board={board} onCellClick={mockOnCellClick} winningCells={winningCells} winningCombo={winningCells} />);
    expect(screen.getByRole('button', { name: 'Cell 1: X' })).toHaveClass('winning');
    expect(screen.getByRole('button', { name: 'Cell 2: X' })).toHaveClass('winning');
    expect(screen.getByRole('button', { name: 'Cell 3: X' })).toHaveClass('winning');
    expect(screen.getByRole('button', { name: 'Cell 4: empty' })).not.toHaveClass('winning');
  });

  it('renders winning line when winningCombo is provided', () => {
    const board = ['X', 'X', 'X', '', '', '', '', '', ''];
    const winningCombo = [0, 1, 2];
    render(<GameBoard board={board} onCellClick={mockOnCellClick} winningCells={winningCombo} winningCombo={winningCombo} />);
    expect(screen.getByTestId('winning-line')).toBeInTheDocument();
  });

  it('does not render winning line when winningCombo is null', () => {
    const board = Array(9).fill('');
    render(<GameBoard board={board} onCellClick={mockOnCellClick} winningCells={[]} winningCombo={null} />);
    expect(screen.queryByTestId('winning-line')).not.toBeInTheDocument();
  });
});
