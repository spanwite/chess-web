import type { Board } from '../Board';
import { Piece } from './Piece';
import { PieceColor, PieceName } from './types';

export class Pawn extends Piece {
  constructor(color: PieceColor, board: Board) {
    super(PieceName.Pawn, color, board);
  }

  getInitialRank() {
    return this.isWhite ? 7 : 2;
  }

  getMovesOffsets() {
    return {
      short: 8,
      long: 16,
      captureLeft: this.isWhite ? 9 : 7,
      captureRight: this.isWhite ? 7 : 9,
    };
  }

  calculateOffset(offset: number) {}

  override getLegalMoves(board: Board): number[] {
    const selfIndex = board.indexOf(this);
    const selfRank = board.rankOf(this);
    const selfFile = board.fileOf(this);

    const moves: number[] = [];
    const movesOffsets = this.getMovesOffsets();

    const calculateOffset = (offset: number) => {
      const direction = this.isWhite ? -1 : 1;
      const index = selfIndex + offset * direction;
      if (index > board.length || index < 0) return;
      moves.push(index);
    };

    calculateOffset(movesOffsets.short);

    if (selfFile !== 'a') {
      calculateOffset(movesOffsets.captureLeft);
    }

    if (selfFile !== 'h') {
      calculateOffset(movesOffsets.captureRight);
    }

    const isAtInitialRank = selfRank === this.getInitialRank();
    if (isAtInitialRank) {
      calculateOffset(movesOffsets.long);
    }

    return moves;
  }
}
