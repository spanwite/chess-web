/**
 * Направление хода: назад/вперёд или влево/вправо.
 */
export type MoveDirection = -1 | 1;

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
}

export enum CastlingSide {
  King = 'kingside',
  Queen = 'queenside',
}
export type CastlingRights = {
  [color in PieceColor]: Record<CastlingSide, boolean>;
};
