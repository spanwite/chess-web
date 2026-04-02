import type { Board } from '../Board';
import { Piece } from './Piece';
import { PieceName, type PieceColor } from './types';

export class Knight extends Piece {
  constructor(color: PieceColor, board: Board) {
    super(PieceName.Knight, color, board, 'n');
  }

  canMove(index: number) {
    const self = this.board.getCoordinatesOf(this.index);
    const target = this.board.getCoordinatesOf(index);

    const diffY = Math.abs(target.y - self.y);
    const diffX = Math.abs(target.x - self.x);

    if ((diffY === 2 && diffX === 1) || (diffY === 1 && diffX === 2)) {
      return true;
    }

    return false;
  }
}
