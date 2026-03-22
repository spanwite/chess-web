import type { Board } from '../Board';
import { Piece } from './Piece';
import { PieceName, type PieceColor } from './types';

export class Queen extends Piece {
  constructor(color: PieceColor, board: Board) {
    super(PieceName.Queen, color, board);
  }

  getLegalMoves() {
    return super
      .getLegalMoves()
      .filter(
        (moveIndex) =>
          super.canMoveHorizontally(moveIndex) ||
          super.canMoveVertically(moveIndex) ||
          super.canMoveDiagonally(moveIndex) ||
          super.canMoveAntiDiagonally(moveIndex)
      );
  }
}
