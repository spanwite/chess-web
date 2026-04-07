import { isUppercase } from '@/utils/string';
import { Board, type Square } from './Board';
import { Bishop, King, Knight, Pawn, Queen, Rook } from './pieces';
import { PieceColor } from './types';

export class Chess {
  static initialFen = 'rnbqknbr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq';

  protected board: Board = new Board();
  protected legalMoves: Record<number, number[]> = [];
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
    const piece = this.getSquare(fromIndex);
    if (!piece || piece.color !== this.turn) {
      return false;
    }
    return this.legalMoves[fromIndex]?.includes(toIndex);
  }

  getMoves(fromIndex: number): number[] {
    return this.legalMoves[fromIndex] || [];
  }

  move(fromIndex: number, toIndex: number): boolean {
    if (!this.canMove(fromIndex, toIndex)) {
      return false;
    }
    this.board.move(fromIndex, toIndex);
    this.switchTurn();
    this.legalMoves = this.board.calculateLegalMoves();
    return true;
  }

  switchTurn() {
    this._turn =
      this._turn === PieceColor.White ? PieceColor.Black : PieceColor.White;
  }

  loadFEN(fen: string): void {
    const [rows, turn, castling] = fen.split(' ');

    this.setTurn(turn);
    this.setCastlingRules(castling);

    let index = 0;
    for (const row of rows.split('/')) {
      const squares = row.split('');
      for (const square of squares) {
        const number = parseInt(square);
        if (!Number.isNaN(number)) {
          index += number;
          continue;
        }

        this.placePiece(square, index);

        index++;
      }
    }

    this.legalMoves = this.board.calculateLegalMoves();
  }

  public placePiece(type: string, index: number): boolean {
    const constructor = {
      q: Queen,
      p: Pawn,
      k: King,
      b: Bishop,
      r: Rook,
      n: Knight,
    }[type.toLowerCase()];
    if (!constructor) return false;
    const color = isUppercase(type) ? PieceColor.White : PieceColor.Black;
    const piece = new constructor(color, this.board);
    piece.place(index);
    return true;
  }

  setTurn(fenLetter: string): boolean {
    fenLetter = fenLetter.toLowerCase();
    if (fenLetter === 'w') {
      this._turn = PieceColor.White;
      return true;
    }
    if (fenLetter === 'b') {
      this._turn = PieceColor.Black;
      return true;
    }
    return false;
  }

  setCastlingRules(fenCastling: string): void {
    this.board.castlingRules = {
      [PieceColor.White]: {
        kingside: fenCastling.includes('K'),
        queenside: fenCastling.includes('Q'),
      },
      [PieceColor.Black]: {
        kingside: fenCastling.includes('k'),
        queenside: fenCastling.includes('q'),
      },
    };
  }
}
