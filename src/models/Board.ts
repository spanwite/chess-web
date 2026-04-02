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
import { noop } from '@/utils/function';

export type MaybePiece = Piece | null;

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

export class Board {
  static initialFEN = 'rnbqknbr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w';
  public readonly files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
  protected kingSymbols = {
    [PieceColor.White]: Symbol('white-king'),
    [PieceColor.Black]: Symbol('black-king'),
  };
  public turn: PieceColor = PieceColor.White;
  public moves: BoardMove[] = [];
  public undoLastMove = noop;

  readonly size = 8;
  pieces: Record<number | symbol, Piece> = {};
  readonly squares = Array.from({ length: this.length }).map(
    (_, index) => index
  );

  constructor() {
    // this.loadFromFEN(Board.initialFEN);
    // this.loadFromFEN('rnbqkbnr/p7/1ppppp1p/6p1/8/2NPPQP1/PPPBNPBP/R3K2R');
    this.loadFEN('4k3/1qq5/8/8/8/8/8/R3K2R b');
  }

  get length() {
    return this.size * this.size;
  }

  getPieces(): Piece[] {
    return Object.values(this.pieces).sort((a, b) => a.id.localeCompare(b.id));
  }

  getKing(color: PieceColor): King {
    return this.pieces[this.kingSymbols[color]] as King;
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

  getCoordinatesOf(index: number): Position {
    return {
      x: this.getXOf(index),
      y: this.getYOf(index),
    };
  }

  getFileOf(index: number): (typeof this.files)[number] {
    return this.files[this.getXOf(index)];
  }

  getRankOf(index: number): number {
    return this.size - this.getYOf(index);
  }

  loadFEN(fen: string): void {
    const [rows, turn] = fen.split(' ');

    this.turn = this.getColorFromFEN(turn);

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
        if (piece instanceof King) {
          this.pieces[this.kingSymbols[piece.color]] = piece;
        }

        index++;
      }
    }
  }

  getColorFromFEN(char: string): PieceColor {
    return char === 'w' ? PieceColor.White : PieceColor.Black;
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

  getPieceAt(index: number): MaybePiece;
  getPieceAt(x: number, y: number): MaybePiece;
  getPieceAt(arg1: number, arg2?: number): MaybePiece {
    const index = arg2 ? this.getIndexOf(arg1, arg2) : arg1;
    return this.pieces[index] || null;
  }

  setPieceAt(index: number, piece: Piece): void {
    this.pieces[index] = piece;
    piece.index = index;
  }

  /**
   * Перемещает фигуру с текущей позиции на переданную клетку
   * @param piece - Фигура, которая выполнит перемещение
   * @param index - Индекс клетки, на которую переместится фигура
   * @returns Функция для отмены выполненного перемещения
   */
  movePiece(piece: Piece, index: number): PieceMove {
    const eatenPiece = this.pieces[index];
    const fromIndex = piece.index;

    this.setPieceAt(index, piece);
    delete this.pieces[fromIndex];

    this.undoLastMove = () => {
      if (eatenPiece) {
        this.setPieceAt(index, eatenPiece);
      } else {
        delete this.pieces[index];
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
}
