import type { Board } from '../Board';
import { Piece, type PieceMove } from '../Piece';
import type { Rook } from './Rook';
import {
  CastlingSide,
  PieceName,
  type MoveDirection,
  type PieceColor,
} from '../types';

export class King extends Piece {
  constructor(color: PieceColor, board: Board) {
    super(PieceName.King, color, board);
  }

  protected getCastlingDirection(index: number): MoveDirection {
    return index > this.index ? 1 : -1;
  }

  protected getCastlingCoordinates(direction: MoveDirection): [number, number] {
    const [_, initialY] = this.board.getCoordinatesOf(this.initialIndex);
    return [direction === 1 ? 6 : 2, initialY];
  }

  /**
   * Проверяет, является ли клетка местом для выполнения рокировки.
   * @param index - Индекс клетки
   */
  protected getCastlingInfo(
    index: number
  ): null | [MoveDirection, Rook, number, number] {
    if (index === this.index) {
      return null;
    }
    const direction = this.getCastlingDirection(index);
    const rook = this.findCastlingRook(direction);
    if (!rook) {
      return null;
    }

    const [, selfY] = this.getCoordinates();
    const [targetX, targetY] = this.board.getCoordinatesOf(index);
    const [, initialY] = this.board.getCoordinatesOf(this.initialIndex);
    const [castlingX, castlingY] = this.getCastlingCoordinates(direction);

    if (
      rook.index === index ||
      (selfY === initialY && selfY === targetY && targetX === castlingX)
    ) {
      return [direction, rook, castlingX, castlingY];
    }

    return null;
  }

  /**
   * Ищет ближайшую ладью по стороне от короля.
   * @param direction - Направление хода.
   */
  protected findCastlingRook(direction: MoveDirection): Rook | null {
    const [selfX, selfY] = this.getCoordinates();

    let x = selfX;
    while (x >= 0 && x < this.board.size) {
      x += direction;
      const piece = this.board.getPieceAt(x, selfY);
      if (piece && piece.name === PieceName.Rook) {
        return piece;
      }
    }

    return null;
  }

  /**
   * Проверяет, может ли фигура сделать рокировку на клетку.
   * @param index - Индекс клетки
   */
  protected canCastle(
    index: number
  ): false | [MoveDirection, Rook, number, number] {
    const castlingInfo = this.getCastlingInfo(index);

    if (!castlingInfo || this.hasMoved()) {
      return false;
    }

    const [direction, rook, castlingX, castlingY] = castlingInfo;
    const castlingSide =
      direction === 1 ? CastlingSide.King : CastlingSide.Queen;
    if (!this.board.castlingRules[this.color][castlingSide]) {
      return false;
    }
    const castlingIndex = this.board.getIndexOf(castlingX, castlingY);

    if (this.isCastlingAttacked(direction)) {
      return false;
    }

    if (
      rook.hasMoved() ||
      !this.canMoveHorizontally(rook.index) ||
      !rook.canMoveHorizontally(castlingIndex)
    ) {
      return false;
    }

    return castlingInfo;
  }

  protected isCastlingAttacked(direction: MoveDirection): boolean {
    const [selfX, selfY] = this.getCoordinates();
    const castlingX = direction === 1 ? 6 : 2;
    const minX = Math.min(selfX, castlingX);
    const maxX = Math.max(selfX, castlingX);

    for (let x = minX; x <= maxX; x++) {
      if (this.board.isSquareAttackedBy(x, selfY, this.enemyColor)) {
        return true;
      }
    }

    return false;
  }

  override calculateNotation(index: number): string {
    const castlingInfo = this.getCastlingInfo(index);
    if (!castlingInfo) {
      return super.calculateNotation(index);
    }
    const [direction] = castlingInfo;
    return direction === -1 ? 'O-O-O' : 'O-O';
  }

  override canMove(index: number): boolean {
    return super.canMoveInRadius(index, 1) || this.canCastle(index) !== false;
  }

  override move(index: number): PieceMove[] {
    const canCastle = this.canCastle(index);

    if (!canCastle) {
      return super.move(index);
    }

    const [direction, rook] = canCastle;

    return [...super.move(index), ...rook.move(index - direction)];
  }
}
