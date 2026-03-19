import type { Board } from '../Board';
import { Piece } from './Piece';
import { PieceColor, PieceName } from './types';

export class Pawn extends Piece {
  constructor(color: PieceColor) {
    super(PieceName.Pawn, color);
  }

  getInitialRank() {
    return this.isWhite ? 7 : 2;
  }

  getMovesOffsets() {
    const direction = this.isWhite ? 1 : -1;
    return {
      short: 8 * direction,
      long: 16 * direction,
      captureLeft: 9 * direction,
      captureRight: 7 * direction,
    };
  }

  getPseudoLegalMoves(board: Board): number[] {
    const moves: number[] = [];
    const movesOffsets = this.getMovesOffsets();

    moves.push(movesOffsets.short);

    moves.push(movesOffsets.captureLeft);

    moves.push(movesOffsets.captureRight);

    const isAtInitialRank = board.rankOf(this) === this.getInitialRank();
    if (isAtInitialRank) {
      moves.push(movesOffsets.long);
    }

    return moves;
  }
}
