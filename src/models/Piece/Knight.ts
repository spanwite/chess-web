import type { Board } from '../Board';
import { Piece } from './Piece';
import { PieceName, type PieceColor } from './types';

export class Knight extends Piece {
  constructor(color: PieceColor, board: Board) {
    super(PieceName.Knight, color, board, 'n');
  }

  canMove(index: number) {
    const [selfX, selfY] = this.getCoordinates();
    const [targetX, targetY] = this.board.getCoordinatesOf(index);

    const deltaY = Math.abs(selfY - targetY);
    const deltaX = Math.abs(selfX - targetX);

    if ((deltaY === 2 && deltaX === 1) || (deltaY === 1 && deltaX === 2)) {
      return true;
    }

    return false;
  }
}
