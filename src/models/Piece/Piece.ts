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

  // static fromCharFEN(char: string, board: Board): MaybePiece {
  //   const constructor = {
  //     p: Pawn,
  //     q: Queen,
  //   }[char.toLowerCase()];
  //   if (!constructor) return null;
  //   const color = isUppercase(char) ? PieceColor.White : PieceColor.Black;
  //   return new constructor(color, board);
  // }

  get isWhite() {
    return this.color === PieceColor.White;
  }

  getIndex() {
    return this.board.indexOf(this);
  }

  getLegalMoves() {
    const moves: number[] = [];
    this.board.squares.forEach((square, index) => {
      if (this.canMove(square)) {
        moves.push(index);
      }
    });
    return moves;
  }

  isSameColor(piece: Piece) {
    return this.color === piece.color;
  }

  isSameVertical(index: number) {
    const size = this.board.size;
    const selfIndex = this.board.indexOf(this);
    return index % size === selfIndex % size;
  }

  canMoveVerticallyTo(index: number) {
    const size = this.board.size;
    const selfIndex = this.board.indexOf(this);

    for (
      let i = Math.min(selfIndex, index) + size;
      i < Math.max(selfIndex, index);
      i += size
    ) {
      const piece = this.board.pieceAt(i);
      if (piece) {
        return false;
      }
    }

    return true;
  }

  canMove(square: MaybePiece): boolean {
    if (!square) return true;
    if (this.isSameColor(square)) return false;
    if (square.name === PieceName.King) return false;
    return true;
  }

  bakGetVerticalLegalMoves(
    direction: 'next' | 'previous' | 'both' = 'both',
    depth = this.board.size
  ) {
    const currentIndex = this.getIndex();
    const moves: number[] = [];

    for (let i = 1; i < depth; i++) {
      const targetIndex = currentIndex + i * this.board.size;
      if (targetIndex >= this.board.length) break;
      const targetSquare = this.board.pieceAt(targetIndex);
      const canMove = this.canMove(targetSquare);
      if (canMove) continue;
      moves.push(targetIndex);
      if (targetSquare) break;
    }

    return moves;
  }

  getVerticalLegalMoves(
    direction: 'next' | 'previous' | 'both' = 'both',
    depth = this.board.size
  ) {
    const currentIndex = this.getIndex();
    const movesNext: number[] = [];
    const movesPrevious: number[] = [];

    for (let i = 1; i < depth; i++) {
      const targetIndex = currentIndex + i * this.board.size;
      if (targetIndex >= this.board.length) break;
      const piece = this.board.pieceAt(targetIndex);
      if (piece && piece.isSameColor(this)) continue;
      movesNext.push(targetIndex);
      if (piece) break;
    }

    return movesNext;
  }

  getPreviousVerticalLegalMoves(depth = this.board.size) {
    const currentIndex = this.getIndex();
    const moves: number[] = [];

    for (let i = 1; i < depth; i++) {
      const targetIndex = currentIndex - i * this.board.size;
      if (targetIndex < 0) break;
      const piece = this.board.pieceAt(targetIndex);
      if (piece && piece.isSameColor(this)) continue;
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
