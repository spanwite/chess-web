import type { Board } from '../Board';
import { Piece } from '../Piece';
import { PieceColor, PieceName } from '../types';

export class Pawn extends Piece {
  constructor(color: PieceColor, board: Board) {
    super(PieceName.Pawn, color, board, '');
  }

  canMoveVertically(index: number): boolean {
    if (!this.isOnSameVertical(index)) {
      return false;
    }
    const [, selfY] = this.getCoordinates();
    const [, targetY] = this.board.getCoordinatesOf(index);
    const piece = this.board.getPieceAt(index);

    if (this.isWhite) {
      if (targetY > selfY) return false;
    } else {
      if (targetY < selfY) return false;
    }

    const diffY = Math.abs(selfY - targetY);

    if (diffY === 1) {
      return piece === null;
    }

    const startY = this.isWhite ? 6 : 1;
    if (diffY === 2 && startY === selfY) {
      return piece === null && super.canMoveVertically(index);
    }

    return false;
  }

  canMoveDiagonally(index: number): boolean {
    if (!super.isOnSameDiagonal(index) && !this.isOnSameAntiDiagonal(index)) {
      return false;
    }

    const [selfX, selfY] = this.getCoordinates();
    const [targetX, targetY] = this.board.getCoordinatesOf(index);
    const piece = this.board.getPieceAt(index);

    if (this.isWhite) {
      if (targetY > selfY) return false;
    } else {
      if (targetY < selfY) return false;
    }

    const deltaY = Math.abs(targetY - selfY);
    const deltaX = Math.abs(targetX - selfX);

    return deltaY <= 1 && deltaX === 1 && piece !== null;
  }

  canMove(index: number): boolean {
    return this.canMoveVertically(index) || this.canMoveDiagonally(index);
  }
}
