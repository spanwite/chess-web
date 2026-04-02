import { PieceName, PieceColor } from './types';
import type { Board, BoardMove } from '../Board';
import { generateId } from '@/utils/string';

export type Position = { x: number; y: number };

export abstract class Piece {
  /**
   * Уникальный идентификатор фигуры
   * @remarks Необходим для корректной отрисовки в React
   */
  public readonly id = generateId();

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

  get isWhite() {
    return this.color === PieceColor.White;
  }

  get enemyColor() {
    return this.color === PieceColor.White
      ? PieceColor.Black
      : PieceColor.White;
  }

  getCoordinates() {
    return this.board.getCoordinatesOf(this.index);
  }

  isSameColor(piece: Piece) {
    return this.color === piece.color;
  }

  onSameHorizontal(index: number): boolean;
  onSameHorizontal(x: number, y: number): boolean;
  onSameHorizontal(arg1: number, arg2?: number): boolean {
    const self = this.getCoordinates();
    const target = arg2
      ? { x: arg1, y: arg2 }
      : this.board.getCoordinatesOf(arg1);
    return self.y === target.y;
  }

  onSameVertical(index: number): boolean;
  onSameVertical(x: number, y: number): boolean;
  onSameVertical(arg1: number, arg2?: number): boolean {
    const self = this.getCoordinates();
    const target = arg2
      ? { x: arg1, y: arg2 }
      : this.board.getCoordinatesOf(arg1);
    return self.x === target.x;
  }

  onSameDiagonal(index: number): boolean;
  onSameDiagonal(x: number, y: number): boolean;
  onSameDiagonal(arg1: number, arg2?: number): boolean {
    const selfCoords = this.getCoordinates();
    const targetCoords = arg2
      ? { x: arg1, y: arg2 }
      : this.board.getCoordinatesOf(arg1);
    return selfCoords.y + selfCoords.x === targetCoords.y + targetCoords.x;
  }

  onSameAntiDiagonal(index: number): boolean;
  onSameAntiDiagonal(x: number, y: number): boolean;
  onSameAntiDiagonal(arg1: number, arg2?: number): boolean {
    const selfCoords = this.getCoordinates();
    const targetCoords = arg2
      ? { x: arg1, y: arg2 }
      : this.board.getCoordinatesOf(arg1);
    return selfCoords.y - selfCoords.x === targetCoords.y - targetCoords.x;
  }

  canMoveDiagonally(index: number): boolean;
  canMoveDiagonally(x: number, y: number): boolean;
  canMoveDiagonally(arg1: number, arg2?: number): boolean {
    const self = this.getCoordinates();
    const target = arg2
      ? { x: arg1, y: arg2 }
      : this.board.getCoordinatesOf(arg1);

    if (!this.onSameDiagonal(target.x, target.y)) {
      return false;
    }

    const maxY = Math.max(self.y, target.y);
    const minX = Math.min(self.x, target.x);
    const maxX = Math.max(self.x, target.x);
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

  canMoveAntiDiagonally(index: number): boolean;
  canMoveAntiDiagonally(x: number, y: number): boolean;
  canMoveAntiDiagonally(arg1: number, arg2?: number): boolean {
    const selfCoords = this.getCoordinates();

    const targetCoords = arg2
      ? { x: arg1, y: arg2 }
      : this.board.getCoordinatesOf(arg1);

    if (!this.onSameAntiDiagonal(targetCoords.x, targetCoords.y)) {
      return false;
    }

    const maxY = Math.max(selfCoords.y, targetCoords.y);
    const minX = Math.min(selfCoords.x, targetCoords.x);
    const maxX = Math.max(selfCoords.x, targetCoords.x);
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

  canMoveHorizontally(index: number): boolean;
  canMoveHorizontally(x: number, y: number): boolean;
  canMoveHorizontally(arg1: number, arg2?: number): boolean {
    const selfCoords = this.getCoordinates();
    const targetCoords = arg2
      ? { x: arg1, y: arg2 }
      : this.board.getCoordinatesOf(arg1);
    if (selfCoords.y !== targetCoords.y) return false;

    const minX = Math.min(selfCoords.x, targetCoords.x);
    const maxX = Math.max(selfCoords.x, targetCoords.x);
    for (let x = minX + 1; x < maxX; x++) {
      if (this.board.getPieceAt(x, selfCoords.y) !== null) return false;
    }
    return true;
  }

  canMoveVertically(index: number): boolean {
    const selfCoords = this.getCoordinates();
    const targetCoords = this.board.getCoordinatesOf(index);
    if (selfCoords.x !== targetCoords.x) return false;

    const minY = Math.min(selfCoords.y, targetCoords.y);
    const maxY = Math.max(selfCoords.y, targetCoords.y);
    for (let y = minY + 1; y < maxY; y++) {
      if (this.board.getPieceAt(selfCoords.x, y) !== null) return false;
    }
    return true;
  }

  isAttacked(): boolean {
    return this.board.isSquareAttackedBy(this.index, this.enemyColor);
  }

  canMove(index: number): boolean {
    const piece = this.board.getPieceAt(index);
    if (piece && this.isSameColor(piece)) return false;

    const king = this.board.getKing(this.color);
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

  abstract getLegalMoves(): number[];
}
