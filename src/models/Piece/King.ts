import type { Board, BoardMove } from '../Board';
import { Piece } from './Piece';
import type { Rook } from './Rook';
import { PieceName, type PieceColor } from './types';

/**
 * Направление хода: назад/вперёд или влево/вправо.
 */
type MoveDirection = -1 | 1;

export class King extends Piece {
  constructor(color: PieceColor, board: Board) {
    super(PieceName.King, color, board);
  }

  /**
   * Проверяет, является ли клетка местом для выполнения рокировки.
   * @param index - Индекс клетки
   */
  protected isCastlingSquare(index: number): boolean {
    const { x, y } = this.getCoordinates();
    const target = this.board.getCoordinatesOf(index);
    const diffX = Math.abs(x - target.x);
    const diffY = Math.abs(y - target.y);
    if (diffY === 0 && diffX === 2) {
      return true;
    }
    return false;
  }

  protected getCastlingDirection(index: number): MoveDirection {
    return index > this.index ? 1 : -1;
  }

  /**
   * Ищет ближайшую ладью по стороне от короля.
   * @param direction - Направление хода.
   */
  protected findCastlingRook(direction: MoveDirection): Rook | null {
    const coordinates = this.getCoordinates();

    let x = coordinates.x;
    while (x >= 0 && x < this.board.size) {
      x += direction;
      const piece = this.board.getPieceAt(x, coordinates.y);
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
  protected canCastle(index: number): false | [MoveDirection, Rook] {
    if (!this.isCastlingSquare(index) || this.hasMoved()) {
      return false;
    }

    const direction = this.getCastlingDirection(index);
    if (
      this.isAttacked() ||
      this.board.isSquareAttackedBy(index - direction, this.enemyColor)
    ) {
      return false;
    }

    const rook = this.findCastlingRook(direction);
    if (!rook || rook.hasMoved() || !this.canMoveHorizontally(rook.index)) {
      return false;
    }

    return [direction, rook];
  }

  canMove(index: number): boolean {
    return super.canMoveInRadius(index, 1) || this.canCastle(index) !== false;
  }

  move(index: number): void {
    const canCastle = this.canCastle(index);

    if (!canCastle) {
      super.move(index);
      return;
    }

    const [direction, rook] = canCastle;
    const kingMove = this.board.movePiece(this, index);
    const rookMove = this.board.movePiece(rook, index - direction);
    const notation = direction === -1 ? 'O-O-O' : 'O-O';

    this.board.moves.push({
      notation,
      moves: [kingMove, rookMove],
    });
  }
}
