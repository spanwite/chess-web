import type { Board } from '../Board';
import { Piece } from '../Piece';
import { PieceName, type PieceColor } from '../types';

export class Bishop extends Piece {
  constructor(color: PieceColor, board: Board) {
    super(PieceName.Bishop, color, board);
  }

  canMove(index: number): boolean {
    return super.canMoveDiagonally(index) || super.canMoveAntiDiagonally(index);
  }
}
