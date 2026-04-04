import type { BoardViewModel } from '@/viewmodels/Chess/BoardViewModel';
import { useViewModel } from '@/hooks/useViewModel';
import Piece from './Piece';
import Square from './Square';

export interface BoardProps {
  model: BoardViewModel;
}

export default function Board({ model }: BoardProps) {
  useViewModel(model);

  return (
    <div class='chess-board'>
      <div class='chess-board__squares' onMouseDown={model.handleSquaresClick}>
        {model.squares.map((square) => (
          <Square key={square} {...model.getSquareProps(square)} />
        ))}
      </div>
      <div class='chess-board__pieces'>
        {model.pieces.map((piece) => (
          <Piece {...model.getPieceProps(piece)} key={piece.initialIndex} />
        ))}
      </div>
    </div>
  );
}
