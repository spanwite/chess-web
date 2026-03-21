import type { Board } from '../Board';
import { Piece } from './Piece';
import { PieceName, type PieceColor } from './types';

export class Queen extends Piece {
  constructor(color: PieceColor, board: Board) {
    super(PieceName.Queen, color, board);
  }

  getLegalMoves(): number[] {
    return super.getLegalMoves().filter((index) => {
      if (!this.isSameVertical(index)) {
        return false;
      }
      if (!this.canMoveVerticallyTo(index)) {
        return false;
      }
      return true;
    });
  }
}
