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
import type { Coordinates } from './Piece/Piece';
import { list } from '@/utils/array';
import { noop } from '@/utils/function';

export type Square = Piece | null;

export interface PieceMove {
  /** Фигура, совершающая перемещение */
  piece: Piece;
  /** Фигура, съеденная перемещающейся фигурой */
  eatenPiece: Piece | null;
  /** Индекс клетки, с которой фигура начинает перемещение */
  fromIndex: number;
  /** Индекс клетки, на которую фигура перемещается */
  toIndex: number;
}

export interface BoardMove {
  /** Алгебраическая нотация хода */
  notation: string;
  /**
   * Фигуры, которые выполнили перемещение
   * @remarks
   * Массив тут необходим для обработки рокировки короля.
   * Рокировка подразумевает движение сразу двух фигур.
   */
  moves: PieceMove[];
}

const FENCollection = {
  basic: 'rnbqknbr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w',
  castling: '4k3/1qq5/8/8/8/8/8/R3K2R w',
};

export class Board {
  readonly size = 8;
  readonly length = this.size * this.size;
  readonly files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
  readonly ranks = [1, 2, 3, 4, 5, 6, 7, 8] as const;

  moves: BoardMove[] = [];
  undoLastMove = noop;

  squares: Square[] = Array(this.length).fill(null);

  constructor() {
    this.loadFEN(FENCollection.basic);
  }

  getIndexOf(x: number, y: number): number {
    return x + y * this.size;
  }

  /**
   * @returns Координата клетки по оси X.
   * @remarks Отсчет начинается с нуля.
   */
  getXOf(index: number): number {
    return index % this.size;
  }

  /**
   * @returns Координата клетки по оси Y.
   * @remarks Отсчет начинается с нуля.
   */
  getYOf(index: number): number {
    return Math.floor(index / this.size);
  }

  /**
   * @returns Координаты клетки в виде кортежа [x, y].
   */
  getCoordinatesOf(index: number): [number, number] {
    return [this.getXOf(index), this.getYOf(index)];
  }

  getFileOf(index: number): (typeof this.files)[number] {
    return this.files[this.getXOf(index)];
  }

  getRankOf(index: number): number {
    return this.size - this.getYOf(index);
  }

  loadFEN(fen: string): void {
    const [rows, turn] = fen.split(' ');

    let index = 0;
    for (const row of rows.split('/')) {
      const squares = row.split('');
      for (const square of squares) {
        const number = parseInt(square);
        if (!Number.isNaN(number)) {
          index += number;
          continue;
        }

        const piece = this.createPieceFromFEN(square);
        if (piece) {
          this.setPieceAt(index, piece);
        }

        index++;
      }
    }
  }

  getColorFromFEN(char: string): PieceColor {
    return char === 'w' ? PieceColor.White : PieceColor.Black;
  }

  createPieceFromFEN(char: string): Piece | null {
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

  getPieceAt(index: number): Square;
  getPieceAt(x: number, y: number): Square;
  getPieceAt(arg1: number, arg2?: number): Square {
    const index = arg2 ? this.getIndexOf(arg1, arg2) : arg1;
    return this.squares[index] || null;
  }

  setPieceAt(index: number, piece: Piece): void {
    this.squares[index] = piece;
    piece.index = index;
  }

  /**
   * Перемещает фигуру с текущей позиции на переданную клетку
   * @param piece - Фигура, которая выполнит перемещение
   * @param index - Индекс клетки, на которую переместится фигура
   * @returns Функция для отмены выполненного перемещения
   */
  movePiece(piece: Piece, index: number): PieceMove {
    const eatenPiece = this.squares[index];
    const fromIndex = piece.index;

    this.setPieceAt(index, piece);
    this.squares[fromIndex] = null;

    this.undoLastMove = () => {
      if (eatenPiece) {
        this.setPieceAt(index, eatenPiece);
      } else {
        this.squares[index] = null;
      }
      this.setPieceAt(fromIndex, piece);
      this.undoLastMove = noop;
    };

    return {
      piece,
      eatenPiece,
      fromIndex,
      toIndex: index,
    };
  }

  // undoMoves(count = 1) {
  //   while (count > 0) {
  //     const move = this.turns.pop();
  //     if (!move) break;
  //     if (move.eatenPiece) {
  //       this.setPieceAt(move.toIndex, move.eatenPiece);
  //     } else {
  //       delete this.pieces[move.toIndex];
  //     }
  //     this.setPieceAt(move.fromIndex, move.piece);
  //     count--;
  //   }
  // }

  findPieces(where: {
    color?: PieceColor;
    name?: PieceName | PieceName[];
  }): Piece[] {
    const { color, name } = where;
    const names = name ? list(name) : [];
    const pieces: Piece[] = [];

    for (const piece of this.squares) {
      if (piece === null) {
        continue;
      }
      if (color && color !== piece.color) {
        continue;
      }
      if (names.length > 0 && !names.includes(piece.name)) {
        continue;
      }
      pieces.push(piece);
    }

    return pieces;
  }

  isSquareAttackedBy(index: number, color: PieceColor) {
    const enemyPieces = this.findPieces({
      color,
    });
    for (const enemyPiece of enemyPieces) {
      const canMove = enemyPiece.canMove(index);
      if (canMove) {
        return true;
      }
    }
    return false;
  }

  calculateLegalMoves(): Record<number, number[]> {
    const legalMoves: Record<number, number[]> = {};
    for (let i = 0; i < this.squares.length; i++) {
      const piece = this.squares[i];
      if (piece === null) {
        continue;
      }
      legalMoves[i] = [];
      for (let j = 0; j < this.squares.length; j++) {
        if (piece.canMove(j) && piece.canMoveLegally(j)) {
          legalMoves[i].push(j);
        }
      }
    }
    return legalMoves;
  }
}
