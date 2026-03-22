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

  getCoordinates() {
    return this.board.coordinatesOf(this.index);
  }

  isSameColor(piece: Piece) {
    return this.color === piece.color;
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
    const selfCoords = this.getCoordinates();

    const targetCoords = arg2
      ? { x: arg1, y: arg2 }
      : this.board.coordinatesOf(arg1);

    if (!this.onSameDiagonal(targetCoords.x, targetCoords.y)) {
      return false;
    }

    const minY = Math.min(selfCoords.y, targetCoords.y);
    const maxY = Math.max(selfCoords.y, targetCoords.y);
    const minX = Math.min(selfCoords.x, targetCoords.x);
    const maxX = Math.max(selfCoords.x, targetCoords.x);
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

  canMoveVertically(index: number): boolean;
  canMoveVertically(x: number, y: number): boolean;
  canMoveVertically(arg1: number, arg2?: number): boolean {
    const selfCoords = this.getCoordinates();
    const targetCoords = arg2
      ? { x: arg1, y: arg2 }
      : this.board.coordinatesOf(arg1);
    if (selfCoords.x !== targetCoords.x) return false;

    const minY = Math.min(selfCoords.y, targetCoords.y);
    const maxY = Math.max(selfCoords.y, targetCoords.y);
    for (let y = minY + 1; y < maxY; y++) {
      if (this.board.pieceAt(selfCoords.x, y) !== null) return false;
    }
    return true;
  }

  canMove(index: number): boolean;
  canMove(x: number, y: number): boolean;
  canMove(piece: Piece): boolean;
  canMove(arg1: number | Piece, arg2?: number): boolean {
    let piece: Piece | null = null;
    if (arg1 instanceof Piece) {
      piece = arg1;
    } else if (arg2 !== undefined) {
      piece = this.board.pieceAt(arg1, arg2);
    } else {
      piece = this.board.pieceAt(arg1);
    }
    if (!piece) return true;
    if (this.isSameColor(piece)) return false;
    if (piece.name === PieceName.King) return false;
    return true;
  }

  getLegalMoves(): number[] {
    return this.board.squares.filter((square) => this.canMove(square));
  }
}
