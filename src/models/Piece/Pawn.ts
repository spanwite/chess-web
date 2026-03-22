import type { Board } from '../Board';
import { Piece } from './Piece';
import { PieceColor, PieceName } from './types';

export class Pawn extends Piece {
  constructor(color: PieceColor, board: Board) {
    super(PieceName.Pawn, color, board);
  }

  getLegalMoves() {
    return this.board.squares.filter((square) => super.canMove(square));
  }
}
