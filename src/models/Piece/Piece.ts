import { PieceName, PieceColor } from './types';
import type { Board } from '../Board';
import { generateId } from '@/utils/string';

export type Coordinates = { x: number; y: number };

export abstract class Piece {
  /**
   * Уникальный идентификатор фигуры
   * @remarks Необходим для корректной отрисовки в React
   */
  readonly id = generateId();

  /** Индекс клетки, на которой расположена фигура в данный момент */
  index = -1;

  /** Имя фигуры */
  readonly name: PieceName;

  /** Цвет фигуры */
  readonly color: PieceColor;

  /** Доска, на которой располагается фигура */
  protected readonly board: Board;

  /**
   * Буквенное наименование фигуры
   * @remarks Используется в алгебраической нотации
   */
  readonly letter: string;

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

  get isWhite() {
    return this.color === PieceColor.White;
  }
  get enemyColor() {
    return this.color === PieceColor.White
      ? PieceColor.Black
      : PieceColor.White;
  }
  isSameColor(piece: Piece) {
    return this.color === piece.color;
  }

  getX(): number {
    return this.board.getXOf(this.index);
  }
  getY(): number {
    return this.board.getYOf(this.index);
  }
  getCoordinates(): [number, number] {
    return this.board.getCoordinatesOf(this.index);
  }
  isAttacked(): boolean {
    return this.board.isSquareAttackedBy(this.index, this.enemyColor);
  }

  isOnSameHorizontal(index: number): boolean {
    return this.getY() === this.board.getYOf(index);
  }
  isOnSameVertical(index: number): boolean {
    return this.getX() === this.board.getXOf(index);
  }
  isOnSameDiagonal(index: number): boolean {
    return (
      this.getY() + this.getX() ===
      this.board.getXOf(index) + this.board.getYOf(index)
    );
  }
  isOnSameAntiDiagonal(index: number): boolean {
    return (
      this.getY() - this.getX() ===
      this.board.getYOf(index) - this.board.getXOf(index)
    );
  }

  canMoveDiagonally(index: number): boolean {
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

  canMoveAntiDiagonally(index: number): boolean {
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

  canMoveHorizontally(index: number): boolean {
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

  canMoveVertically(index: number): boolean {
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

  canMoveInRadius(index: number, radius: number): boolean {
    const [selfX, selfY] = this.getCoordinates();
    const [targetX, targetY] = this.board.getCoordinatesOf(index);

    return (
      Math.abs(selfX - targetX) <= radius && Math.abs(selfY - targetY) <= radius
    );
  }

  canMoveLegally(index: number): boolean {
    const piece = this.board.getPieceAt(index);
    if (piece && this.isSameColor(piece)) return false;

    const [king] = this.board.findPieces({
      color: this.color,
      name: PieceName.King,
    });
    this.board.movePiece(this, index);
    const isAttacked = king.isAttacked();
    this.board.undoLastMove();

    return !isAttacked;
  }

  /**
   * Возвращает алгебраическую нотацию хода фигуры на клетку.
   * @param index - Индекс клетки назначения
   */
  getMoveNotation(index: number): string {
    const captureMark = this.board.getPieceAt(index) !== null ? 'x' : '';

    const piecesCanMoveSimilarly = this.board
      .findPieces({
        color: this.color,
        name: this.name,
      })
      .filter((piece) => piece !== this && piece.canMove(index));
    const needPrefix =
      piecesCanMoveSimilarly.length > 0 || (captureMark && !this.letter);
    const prefix = needPrefix ? this.board.getFileOf(this.index) : '';

    const targetPosition = `${this.board.getFileOf(index)}${this.board.getRankOf(index)}`;

    return `${prefix}${this.letter}${captureMark}${targetPosition}`;
  }

  /**
   * Перемещает фигуру на клетку.
   * @param index - Индекс клетки назначения.
   */
  move(index: number): void {
    const notation = this.getMoveNotation(index);
    const move = this.board.movePiece(this, index);
    this.board.moves.push({ notation, moves: [move] });
  }

  /**
   * Проверяет, ходила ли фигура.
   * @remarks Перебирает массив истории ходов и ищет в нем текущую фигуру.
   */
  hasMoved(): boolean {
    for (const { moves: movedPieces } of this.board.moves) {
      for (const pieceMove of movedPieces) {
        if (pieceMove.piece === this) return true;
      }
    }
    return false;
  }

  abstract canMove(index: number): boolean;
}
