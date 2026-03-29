import { isUppercase } from '@/utils/string';
import {
  Piece,
  King,
  Pawn,
  PieceColor,
  Queen,
  Rook,
  Bishop,
  Knight,
  PieceName,
} from './Piece';
import type { Position } from './Piece/Piece';
import { list } from '@/utils/array';

export type MaybePiece = Piece | null;

export class Board {
  static initialFEN = 'rnbqknbr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
  protected kingSymbols = {
    [PieceColor.White]: Symbol('white-king'),
    [PieceColor.Black]: Symbol('black-king'),
  };
  public turn: PieceColor = PieceColor.White;

  readonly size = {
    x: 8,
    y: 8,
  };
  pieces: Record<number | symbol, Piece> = {};
  readonly squares = Array.from({ length: this.length }).map(
    (_, index) => index
  );

  get length() {
    return this.size.x * this.size.y;
  }

  getPieces(): Piece[] {
    return Object.values(this.pieces).sort((a, b) => a.id.localeCompare(b.id));
  }

  getKing(color: PieceColor): King {
    return this.pieces[this.kingSymbols[color]];
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
        if (piece instanceof King) {
          this.pieces[this.kingSymbols[piece.color]] = piece;
        }

        index++;
      }
    }
  }

  createPieceFromFEN(char: string): MaybePiece {
    const constructor = {
      q: Queen,
      p: Pawn,
      k: King,
      b: Bishop,
      r: Rook,
      n: Knight,
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
    const fromIndex = piece.index;
    this.placePiece(piece, index);
    delete this.pieces[fromIndex];
    this.switchTurn();
  }

  /** Возвращает функцию для отмены выполненного хода */
  movePieceTemporary(piece: Piece, index: number): () => void {
    const replacedPiece = this.pieces[index];
    const fromIndex = piece.index;

    this.placePiece(piece, index);
    delete this.pieces[fromIndex];

    return () => {
      if (replacedPiece) {
        this.placePiece(replacedPiece, index);
      } else {
        delete this.pieces[index];
      }
      this.placePiece(piece, fromIndex);
    };
  }

  findPieces(where: {
    color?: PieceColor;
    name?: PieceName | PieceName[];
  }): Piece[] {
    const { color, name } = where;
    const names = name ? list(name) : [];

    return Object.values(this.pieces).filter((piece) => {
      if (color && color !== piece.color) {
        return false;
      }
      if (names.length > 0 && !names.includes(piece.name)) {
        return false;
      }
      return true;
    });
  }

  switchTurn() {
    this.turn =
      this.turn === PieceColor.White ? PieceColor.Black : PieceColor.White;
  }
}
