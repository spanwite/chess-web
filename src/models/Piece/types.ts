import type { Board } from '../Board';

export enum PieceColor {
  White = 'white',
  Black = 'black',
}

export enum PieceName {
  Pawn = 'pawn',
  Rook = 'rook',
  Knight = 'knight',
  Bishop = 'bishop',
  King = 'king',
  Queen = 'queen',
}

export interface IPiece {
  name: PieceName;
  color: PieceColor;

  getLegalMoves(board: Board): number[];
}
