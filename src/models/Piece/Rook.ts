import type { Board } from '../Board';
import { Piece } from './Piece';
import { PieceName, type PieceColor } from './types';

export class Rook extends Piece {
  constructor(color: PieceColor, board: Board) {
    super(PieceName.Rook, color, board);
  }

  canMove(index: number): boolean {
    return super.canMoveHorizontally(index) || super.canMoveVertically(index);
  }
}
