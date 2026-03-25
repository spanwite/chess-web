import type { Board } from '../Board';
import { Piece } from './Piece';
import { PieceName, type PieceColor } from './types';

export class King extends Piece {
  constructor(color: PieceColor, board: Board) {
    super(PieceName.King, color, board);
  }

  canMove(index: number): boolean {
    const target = this.board.coordinatesOf(index);
    const { x, y } = this.getCoordinates();
    return Math.abs(x - target.x) <= 1 && Math.abs(y - target.y) <= 1;
  }

  getLegalMoves(): number[] {
    return this.board.squares.filter(
      (index) => this.canMove(index) && super.canMove(index)
    );
  }
}
