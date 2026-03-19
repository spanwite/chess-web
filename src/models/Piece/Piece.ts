import { isUppercase } from '@/utils/string';
import { Pawn } from './Pawn';
import { type IPiece, PieceName, PieceColor } from './types';
import type { Board } from '../Board';

export type MaybePiece = Piece | null;

export type Direction = 'vertial' | 'horizontal' | 'ascending' | 'descending';

export class Piece implements IPiece {
  readonly name: PieceName;
  readonly color: PieceColor;
  protected readonly board: Board;

  constructor(name: PieceName, color: PieceColor, board: Board) {
    this.name = name;
    this.color = color;
    this.board = board;
  }

  static fromCharFEN(char: string, board: Board): MaybePiece {
    const constructor = {
      p: Pawn,
    }[char.toLowerCase()];
    if (!constructor) return null;
    const color = isUppercase(char) ? PieceColor.White : PieceColor.Black;
    return new constructor(color, board);
  }

  get isWhite() {
    return this.color === PieceColor.White;
  }

  getIndex() {
    return this.board.indexOf(this);
  }

  getLegalMoves(board: Board) {
    return Array.from({ length: board.length }).map((_, index) => index);
  }

  sameColor(piece: Piece) {
    return this.color === piece.color;
  }

  getNextVerticalLegalMoves(depth = this.board.size) {
    const currentIndex = this.getIndex();
    const moves: number[] = [];

    for (let i = 1; i < depth; i++) {
      const targetIndex = currentIndex + i * this.board.size;
      if (targetIndex >= this.board.length) break;
      const piece = this.board.pieceAt(targetIndex);
      if (piece && piece.sameColor(this)) continue;
      moves.push(targetIndex);
      if (piece) break;
    }

    return moves;
  }

  getPreviousVerticalLegalMoves(depth = this.board.size) {
    const currentIndex = this.getIndex();
    const moves: number[] = [];

    for (let i = 1; i < depth; i++) {
      const targetIndex = currentIndex - i * this.board.size;
      if (targetIndex < 0) break;
      const piece = this.board.pieceAt(targetIndex);
      if (piece && piece.sameColor(this)) continue;
      moves.push(targetIndex);
      if (piece) break;
    }

    return moves;
  }

  getLineLegalMoves(
    directions: Direction | Array<Direction>,
    grab: 'next' | 'previous' | 'all' = 'all',
    depth = this.board.size
  ) {
    directions = Array.isArray(directions) ? directions : [directions];
    const index = this.getIndex();
  }
}
