import type { Board } from '../Board';
import { Piece } from './Piece';
import { PieceColor, PieceName } from './types';

export class Pawn extends Piece {
  constructor(color: PieceColor, board: Board) {
    super(PieceName.Pawn, color, board, '');
  }

  canMoveVertically(index: number): boolean {
    if (!this.onSameVertical(index)) {
      return false;
    }
    const target = this.board.getCoordinatesOf(index);
    const piece = this.board.getPieceAt(index);
    const self = this.getCoordinates();

    if (this.isWhite) {
      if (target.y > self.y) return false;
    } else {
      if (target.y < self.y) return false;
    }

    const diffY = Math.abs(target.y - self.y);

    if (diffY === 1) {
      return piece === null;
    }

    const startY = this.isWhite ? 6 : 1;
    if (diffY === 2 && startY === self.y) {
      return piece === null && super.canMoveVertically(index);
    }

    return false;
  }

  canMoveDiagonally(index: number): boolean;
  canMoveDiagonally(x: number, y: number): boolean;
  canMoveDiagonally(arg1: number, arg2?: number): boolean {
    const self = this.getCoordinates();
    const target = arg2
      ? { x: arg1, y: arg2 }
      : this.board.getCoordinatesOf(arg1);
    const index = this.board.getIndexOf(target.x, target.y);
    const piece = this.board.getPieceAt(index);

    if (!super.onSameDiagonal(index) && !this.onSameAntiDiagonal(index)) {
      return false;
    }

    if (this.isWhite) {
      if (target.y > self.y) return false;
    } else {
      if (target.y < self.y) return false;
    }

    const diffY = Math.abs(target.y - self.y);
    const diffX = Math.abs(target.x - self.x);

    return diffY <= 1 && diffX === 1 && piece !== null;
  }

  canMove(index: number): boolean {
    return this.canMoveVertically(index) || this.canMoveDiagonally(index);
  }
}
