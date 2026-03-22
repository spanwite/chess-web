import { isUppercase } from '@/utils/string';
import { Piece, PieceColor, Queen } from './Piece';
import type { Position } from './Piece/Piece';
import { Pawn } from './Piece/Pawn';

export type MaybePiece = Piece | null;

export class Board {
  static initialFEN = '3q4/pppppppp/8/8/8/8/PPPPPPPP/4Q3';

  readonly size = {
    x: 8,
    y: 8,
  };
  pieces: Record<number, Piece> = {};
  readonly squares = Array.from({ length: this.length }).map(
    (_, index) => index
  );

  get length() {
    return this.size.x * this.size.y;
  }

  getPiecesArray(): Piece[] {
    return Object.values(this.pieces).sort((a, b) => a.id.localeCompare(b.id));
  }

  constructor() {
    this.loadFromFEN(Board.initialFEN);
  }

  coordinatesOf(index: number): Position {
    return {
      x: index % this.size.x,
      y: Math.floor(index / this.size.y),
    };
  }

  indexOf(x: number, y: number): number {
    return x + y * this.size.y;
  }

  loadFromFEN(fen: string) {
    const parts = fen.split(' ');

    let index = 0;
    const rows = parts[0].split('/');
    for (const row of rows) {
      const squares = row.split('');
      for (const square of squares) {
        const number = parseInt(square);
        if (!Number.isNaN(number)) {
          index += number;
          continue;
        }

        const piece = this.createPieceFromFEN(square);
        if (piece) {
          this.placePiece(piece, index);
        }

        index++;
      }
    }
  }

  createPieceFromFEN(char: string): MaybePiece {
    const constructor = {
      q: Queen,
      p: Pawn,
    }[char.toLowerCase()];
    if (!constructor) return null;
    const color = isUppercase(char) ? PieceColor.White : PieceColor.Black;
    return new constructor(color, this);
  }

  placePiece(piece: Piece, index: number): void {
    this.pieces[index] = piece;
    piece.index = index;
  }

  pieceAt(index: number): MaybePiece;
  pieceAt(x: number, y: number): MaybePiece;
  pieceAt(arg1: number, arg2?: number): MaybePiece {
    const index = arg2 ? this.indexOf(arg1, arg2) : arg1;
    return this.pieces[index] || null;
  }

  movePiece(piece: Piece, index: number): void {
    const oldIndex = piece.index;
    this.placePiece(piece, index);
    delete this.pieces[oldIndex];
  }
}
