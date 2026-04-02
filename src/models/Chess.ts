import { Board, type Square } from './Board';
import { PieceColor } from './Piece';

export class Chess {
  protected board = new Board();
  protected legalMoves: Record<number, number[]> =
    this.board.calculateLegalMoves();
  protected _turn: PieceColor = PieceColor.White;

  get squares(): Square[] {
    return this.board.squares;
  }

  get turn(): PieceColor {
    return this._turn;
  }

  getSquare(square: number): Square {
    return this.board.squares[square];
  }

  getIndexOf(x: number, y: number) {
    return this.board.getIndexOf(x, y);
  }

  canMove(fromIndex: number, toIndex: number): boolean {
    return this.legalMoves[fromIndex]?.includes(toIndex);
  }

  move(fromIndex: number, toIndex: number): boolean {
    const movingPiece = this.board.getPieceAt(fromIndex);
    if (!movingPiece || !this.canMove(fromIndex, toIndex)) {
      return false;
    }
    movingPiece.move(toIndex);
    this.switchTurn();
    this.legalMoves = this.board.calculateLegalMoves();
    return true;
  }

  switchTurn() {
    this._turn =
      this._turn === PieceColor.White ? PieceColor.Black : PieceColor.White;
  }
}
