import type { Board } from '../Board';
import { Piece } from './Piece';
import { PieceName, type PieceColor } from './types';

export class King extends Piece {
  constructor(color: PieceColor, board: Board) {
    super(PieceName.King, color, board);
  }

  getLegalMoves(): number[] {
    return super.getLegalMoves().filter((moveIndex) => {
      const target = this.board.coordinatesOf(moveIndex);
      const { x, y } = this.getCoordinates();
      return Math.abs(x - target.x) <= 1 && Math.abs(y - target.y) <= 1;
    });
  }
}
