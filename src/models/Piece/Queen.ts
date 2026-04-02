import type { Board } from '../Board';
import { Piece } from './Piece';
import { PieceName, type PieceColor } from './types';

export class Queen extends Piece {
  constructor(color: PieceColor, board: Board) {
    super(PieceName.Queen, color, board);
  }

  canMove(index: number): boolean {
    return (
      super.canMoveDiagonally(index) ||
      super.canMoveAntiDiagonally(index) ||
      super.canMoveHorizontally(index) ||
      super.canMoveVertically(index)
    );
  }
}
