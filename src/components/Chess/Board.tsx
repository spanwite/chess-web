import type { BoardViewModel } from '@/viewmodels/Chess/Board';
import { useViewModel } from '@/hooks/useViewModel';
import Piece from './Piece';
import Square from './Square';

export interface BoardProps {
  model: BoardViewModel;
}

export default function Board({ model }: BoardProps) {
  const { squares, pieces, handleSquaresClick, hasPieceAt, state, canMove } =
    useViewModel(model);

  const $squares = squares.map((_, square) => {
    const isSelected = state.selectedSquare === square;
    const isAvailable = canMove(state.selectedSquare, square);
    const hasPiece = hasPieceAt(square);
    return (
      <Square
        isSelected={isSelected}
        isHighlighted={hasPiece && isAvailable}
        hasMark={!hasPiece && isAvailable}
        key={square}
        label={square}
      />
    );
  });

  const $pieces = pieces.map((piece) => {
    const [x, y] = piece.getCoordinates();
    return (
      <Piece
        x={x}
        y={y}
        color={piece.color}
        name={piece.name}
        key={piece.initialIndex}
      />
    );
  });

  return (
    <div class='chess-board'>
      <div class='chess-board__squares' onMouseDown={handleSquaresClick}>
        {$squares}
      </div>
      <div class='chess-board__pieces'>{$pieces}</div>
    </div>
  );
}
