import { isUppercase } from '@/utils/string';
import { Pawn, Piece, PieceColor, type MaybePiece } from './Piece';
import { Queen } from './Piece/Queen';

type BoardFile = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';

export class Board {
  readonly files: Record<number, BoardFile> = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
  ];
  readonly size = 8;
  readonly length = this.size * this.size;
  static initialFEN = '3q4/pppppppp/8/8/8/8/PPPPPPPP/4Q3';

  squares: MaybePiece[] = new Array(Board.length).fill(null);

  constructor() {
    this.loadFEN(Board.initialFEN);
  }

  getRandomPiece<T extends Piece = Piece>(
    instanceFilters: (new (...args: any[]) => T)[]
  ): T | null {
    const filtered = this.squares.filter((square) => {
      for (const filter of instanceFilters) {
        if (square instanceof filter) {
          return true;
        }
      }
      return false;
    });
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex] as T;
  }

  loadFEN(fen: string) {
    const parts = fen.split(' ');

    let index = 0;
    const rows = parts[0].split('/');
    for (const row of rows) {
      const squares = row.split('');
      for (const square of squares) {
        const number = parseInt(square);
        if (!Number.isNaN(number)) {
          for (let i = 0; i < number; i++) {
            this.squares[index] = null;
            index++;
          }
          continue;
        }

        this.squares[index] = this.createPieceFromFEN(square);
        index++;
      }
    }
  }

  createPieceFromFEN(char: string): MaybePiece {
    const constructor = {
      p: Pawn,
      q: Queen,
    }[char.toLowerCase()];
    if (!constructor) return null;
    const color = isUppercase(char) ? PieceColor.White : PieceColor.Black;
    return new constructor(color, this);
  }

  movePiece(piece: MaybePiece, toIndex: number): void {
    if (!piece) return;
    const fromIndex = this.indexOf(piece);
    this.squares[toIndex] = piece;
    this.squares[fromIndex] = null;
  }

  indexOf(piece: MaybePiece): number {
    return piece === null ? -1 : this.squares.indexOf(piece);
  }

  rankOf(piece: Piece): number {
    const index = this.indexOf(piece);
    return Math.floor(index / this.size) + 1;
  }

  fileOf(piece: Piece): BoardFile {
    const index = this.indexOf(piece);
    return this.files[index % this.size];
  }

  pieceAt(index: number): MaybePiece {
    return this.squares[index];
  }
}
