import type { Board } from '../Board';
import { Piece } from './Piece';
import { PieceName, type PieceColor } from './types';

export class King extends Piece {
  constructor(color: PieceColor, board: Board) {
    super(PieceName.Queen, color, board);
  }
}
