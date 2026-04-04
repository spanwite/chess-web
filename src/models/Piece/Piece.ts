import { PieceName, PieceColor } from './types';
import type { Board } from '../Board';
import type { NestedArray } from '@/utils/types';

export interface PieceMove {
  /** Фигура, совершающая перемещение */
  movedPiece: Piece;
  /** Фигура, съеденная перемещающейся фигурой */
  eatenPiece: Piece | null;
  /** Индекс клетки, с которой фигура начинает перемещение */
  fromIndex: number;
  /** Индекс клетки, на которую фигура перемещается */
  toIndex: number;
}

export type Coordinates = { x: number; y: number };

export abstract class Piece {
  public initialIndex: number = -1;

  /** Индекс клетки, на которой расположена фигура в данный момент */
  public index = -1;

  /** Имя фигуры */
  public readonly name: PieceName;

  /** Цвет фигуры */
  public readonly color: PieceColor;

  /** Доска, на которой располагается фигура */
  protected readonly board: Board;

  /**
   * Буквенное наименование фигуры
   * @remarks Используется в алгебраической нотации
   */
  public readonly letter: string;

  constructor(
    name: PieceName,
    color: PieceColor,
    board: Board,
    letter = name[0]
  ) {
    this.name = name;
    this.color = color;
    this.board = board;
    this.letter =
      color === PieceColor.White ? letter.toUpperCase() : letter.toLowerCase();
  }

  public abstract canMove(index: number): boolean;

  public canMoveSafely(index: number): boolean {
    const [king] = this.board.findPieces({
      color: this.color,
      name: PieceName.King,
    });
    const moves = this.move(index);
    const isAttacked = king.isAttacked();
    this.revertMoves(moves);

    return !isAttacked;
  }

  public canMoveLegally(index: number): boolean {
    const piece = this.board.getPieceAt(index);
    if (piece === null) {
      return true;
    }
    return !this.isSameColor(piece);
  }

  /**
   * Возвращает алгебраическую нотацию хода фигуры на клетку.
   * @param moveIndex - Индекс клетки назначения
   */
  public calculateNotation(moveIndex: number): string {
    const captureMark = this.board.getPieceAt(moveIndex) !== null ? 'x' : '';

    const piecesCanMoveSimilarly = this.board
      .findPieces({
        color: this.color,
        name: this.name,
      })
      .filter((piece) => piece !== this && piece.canMove(moveIndex));
    const needPrefix =
      piecesCanMoveSimilarly.length > 0 || (captureMark && !this.letter);
    const prefix = needPrefix ? this.board.getFileOf(this.index) : '';

    const targetPosition = `${this.board.getFileOf(moveIndex)}${this.board.getRankOf(moveIndex)}`;

    return `${prefix}${this.letter}${captureMark}${targetPosition}`;
  }

  /**
   * Перемещает фигуру на клетку.
   * @param toIndex - Индекс клетки назначения.
   */
  public move(toIndex: number): PieceMove[] {
    const eatenPiece = this.board.getPieceAt(toIndex);
    const fromIndex = this.index;

    this.place(toIndex);
    this.board.setSquare(fromIndex, null);

    const move = {
      movedPiece: this,
      eatenPiece,
      fromIndex,
      toIndex,
    };

    return [move];
  }

  public place(toIndex: number): void {
    if (this.initialIndex === -1) {
      this.initialIndex = toIndex;
    }
    this.index = toIndex;
    this.board.setSquare(toIndex, this);
  }

  public revertMoves(...moves: NestedArray<PieceMove>): void {
    for (const move of moves) {
      if (Array.isArray(move)) {
        this.revertMoves(...move);
      } else {
        if (move.eatenPiece) {
          move.eatenPiece.place(move.toIndex);
        } else {
          this.board.setSquare(move.toIndex, null);
        }
        move.movedPiece.place(move.fromIndex);
        this.board.setSquare(move.fromIndex, move.movedPiece);
      }
    }
  }

  /**
   * Проверяет, ходила ли фигура.
   * @remarks Перебирает массив истории ходов и ищет в нем текущую фигуру.
   */
  public hasMoved(): boolean {
    for (const { movedPieces } of this.board.moves) {
      for (const { movedPiece } of movedPieces) {
        if (movedPiece === this) return true;
      }
    }
    return false;
  }

  public get isWhite() {
    return this.color === PieceColor.White;
  }

  public get enemyColor() {
    return this.color === PieceColor.White
      ? PieceColor.Black
      : PieceColor.White;
  }

  public isSameColor(piece: Piece) {
    return this.color === piece.color;
  }

  public getX(): number {
    return this.board.getXOf(this.index);
  }

  public getY(): number {
    return this.board.getYOf(this.index);
  }

  public getCoordinates(): [number, number] {
    return this.board.getCoordinatesOf(this.index);
  }

  protected isAttacked(): boolean {
    return this.board.isSquareAttackedBy(this.index, this.enemyColor);
  }

  protected isOnSameHorizontal(index: number): boolean {
    return this.getY() === this.board.getYOf(index);
  }

  protected isOnSameVertical(index: number): boolean {
    return this.getX() === this.board.getXOf(index);
  }

  protected isOnSameDiagonal(index: number): boolean {
    return (
      this.getY() + this.getX() ===
      this.board.getXOf(index) + this.board.getYOf(index)
    );
  }

  protected isOnSameAntiDiagonal(index: number): boolean {
    return (
      this.getY() - this.getX() ===
      this.board.getYOf(index) - this.board.getXOf(index)
    );
  }

  protected canMoveDiagonally(index: number): boolean {
    const [selfX, selfY] = this.getCoordinates();
    const [targetX, targetY] = this.board.getCoordinatesOf(index);

    if (!this.isOnSameDiagonal(index)) {
      return false;
    }

    const maxY = Math.max(selfY, targetY);
    const minX = Math.min(selfX, targetX);
    const maxX = Math.max(selfX, targetX);
    let x = minX + 1;
    let y = maxY - 1;

    while (x < maxX) {
      if (this.board.getPieceAt(x, y) !== null) {
        return false;
      }
      x++;
      y--;
    }

    return true;
  }

  protected canMoveAntiDiagonally(index: number): boolean {
    const [selfX, selfY] = this.getCoordinates();
    const [targetX, targetY] = this.board.getCoordinatesOf(index);

    if (!this.isOnSameAntiDiagonal(index)) {
      return false;
    }

    const maxY = Math.max(selfY, targetY);
    const minX = Math.min(selfX, targetX);
    const maxX = Math.max(selfX, targetX);
    let x = maxX - 1;
    let y = maxY - 1;

    while (x > minX) {
      if (this.board.getPieceAt(x, y) !== null) {
        return false;
      }
      x--;
      y--;
    }

    return true;
  }

  public canMoveHorizontally(index: number): boolean {
    const [selfX, selfY] = this.getCoordinates();
    const targetX = this.board.getXOf(index);

    if (!this.isOnSameHorizontal(index)) return false;

    const minX = Math.min(selfX, targetX);
    const maxX = Math.max(selfX, targetX);
    for (let x = minX + 1; x < maxX; x++) {
      if (this.board.getPieceAt(x, selfY) !== null) return false;
    }
    return true;
  }

  protected canMoveVertically(index: number): boolean {
    const [selfX, selfY] = this.getCoordinates();
    const targetY = this.board.getYOf(index);

    if (!this.isOnSameVertical(index)) return false;

    const minY = Math.min(selfY, targetY);
    const maxY = Math.max(selfY, targetY);
    for (let y = minY + 1; y < maxY; y++) {
      if (this.board.getPieceAt(selfX, y) !== null) return false;
    }
    return true;
  }

  protected canMoveInRadius(index: number, radius: number): boolean {
    const [selfX, selfY] = this.getCoordinates();
    const [targetX, targetY] = this.board.getCoordinatesOf(index);

    return (
      Math.abs(selfX - targetX) <= radius && Math.abs(selfY - targetY) <= radius
    );
  }
}
