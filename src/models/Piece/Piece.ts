import { PieceName, PieceColor } from './types';
import type { Board } from '../Board';
import { generateId } from '@/utils/string';

export type Position = { x: number; y: number };

export class Piece {
  public readonly id = generateId();
  public index = -1;

  constructor(
    public readonly name: PieceName,
    public readonly color: PieceColor,
    protected readonly board: Board
  ) {}

  get isWhite() {
    return this.color === PieceColor.White;
  }

  get enemyColor() {
    return this.color === PieceColor.White
      ? PieceColor.Black
      : PieceColor.White;
  }

  getCoordinates() {
    return this.board.coordinatesOf(this.index);
  }

  isSameColor(piece: Piece) {
    return this.color === piece.color;
  }

  onSameHorizontal(index: number): boolean;
  onSameHorizontal(x: number, y: number): boolean;
  onSameHorizontal(arg1: number, arg2?: number): boolean {
    const self = this.getCoordinates();
    const target = arg2 ? { x: arg1, y: arg2 } : this.board.coordinatesOf(arg1);
    return self.y === target.y;
  }

  onSameVertical(index: number): boolean;
  onSameVertical(x: number, y: number): boolean;
  onSameVertical(arg1: number, arg2?: number): boolean {
    const self = this.getCoordinates();
    const target = arg2 ? { x: arg1, y: arg2 } : this.board.coordinatesOf(arg1);
    return self.x === target.x;
  }

  onSameDiagonal(index: number): boolean;
  onSameDiagonal(x: number, y: number): boolean;
  onSameDiagonal(arg1: number, arg2?: number): boolean {
    const selfCoords = this.getCoordinates();
    const targetCoords = arg2
      ? { x: arg1, y: arg2 }
      : this.board.coordinatesOf(arg1);
    return selfCoords.y + selfCoords.x === targetCoords.y + targetCoords.x;
  }

  onSameAntiDiagonal(index: number): boolean;
  onSameAntiDiagonal(x: number, y: number): boolean;
  onSameAntiDiagonal(arg1: number, arg2?: number): boolean {
    const selfCoords = this.getCoordinates();
    const targetCoords = arg2
      ? { x: arg1, y: arg2 }
      : this.board.coordinatesOf(arg1);
    return selfCoords.y - selfCoords.x === targetCoords.y - targetCoords.x;
  }

  canMoveDiagonally(index: number): boolean;
  canMoveDiagonally(x: number, y: number): boolean;
  canMoveDiagonally(arg1: number, arg2?: number): boolean {
    const self = this.getCoordinates();
    const target = arg2 ? { x: arg1, y: arg2 } : this.board.coordinatesOf(arg1);

    if (!this.onSameDiagonal(target.x, target.y)) {
      return false;
    }

    const maxY = Math.max(self.y, target.y);
    const minX = Math.min(self.x, target.x);
    const maxX = Math.max(self.x, target.x);
    let x = minX + 1;
    let y = maxY - 1;

    while (x < maxX) {
      if (this.board.pieceAt(x, y) !== null) {
        return false;
      }
      x++;
      y--;
    }

    return true;
  }

  canMoveAntiDiagonally(index: number): boolean;
  canMoveAntiDiagonally(x: number, y: number): boolean;
  canMoveAntiDiagonally(arg1: number, arg2?: number): boolean {
    const selfCoords = this.getCoordinates();

    const targetCoords = arg2
      ? { x: arg1, y: arg2 }
      : this.board.coordinatesOf(arg1);

    if (!this.onSameAntiDiagonal(targetCoords.x, targetCoords.y)) {
      return false;
    }

    const maxY = Math.max(selfCoords.y, targetCoords.y);
    const minX = Math.min(selfCoords.x, targetCoords.x);
    const maxX = Math.max(selfCoords.x, targetCoords.x);
    let x = maxX - 1;
    let y = maxY - 1;

    while (x > minX) {
      if (this.board.pieceAt(x, y) !== null) {
        return false;
      }
      x--;
      y--;
    }

    return true;
  }

  canMoveHorizontally(index: number): boolean;
  canMoveHorizontally(x: number, y: number): boolean;
  canMoveHorizontally(arg1: number, arg2?: number): boolean {
    const selfCoords = this.getCoordinates();
    const targetCoords = arg2
      ? { x: arg1, y: arg2 }
      : this.board.coordinatesOf(arg1);
    if (selfCoords.y !== targetCoords.y) return false;

    const minX = Math.min(selfCoords.x, targetCoords.x);
    const maxX = Math.max(selfCoords.x, targetCoords.x);
    for (let x = minX + 1; x < maxX; x++) {
      if (this.board.pieceAt(x, selfCoords.y) !== null) return false;
    }
    return true;
  }

  canMoveVertically(index: number): boolean {
    const selfCoords = this.getCoordinates();
    const targetCoords = this.board.coordinatesOf(index);
    if (selfCoords.x !== targetCoords.x) return false;

    const minY = Math.min(selfCoords.y, targetCoords.y);
    const maxY = Math.max(selfCoords.y, targetCoords.y);
    for (let y = minY + 1; y < maxY; y++) {
      if (this.board.pieceAt(selfCoords.x, y) !== null) return false;
    }
    return true;
  }

  canMove(index: number): boolean {
    const piece = this.board.pieceAt(index);
    if (piece && this.isSameColor(piece)) return false;

    const king = this.board.getKing(this.color);
    const undo = this.board.movePiece(this, index);
    const enemyPieces = this.board.findPieces({
      color: this.enemyColor,
    });
    for (const enemyPiece of enemyPieces) {
      const canMove = enemyPiece.canMove(king.index);
      if (canMove) {
        undo();
        return false;
      }
    }
    undo();

    return true;
  }

  getLegalMoves(): number[] {
    return this.board.squares.filter((square) => this.canMove(square));
  }
}
