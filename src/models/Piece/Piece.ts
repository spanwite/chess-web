import { isUppercase } from '@/utils/string';
import { Pawn } from './Pawn';
import { type IPiece, PieceName, PieceColor } from './types';

export type MaybePiece = Piece | null;

export class Piece implements IPiece {
  readonly name: PieceName;
  readonly color: PieceColor;

  constructor(name: PieceName, color: PieceColor) {
    this.name = name;
    this.color = color;
  }

  static fromCharFEN(char: string): MaybePiece {
    const constructor = {
      p: Pawn,
    }[char.toLowerCase()];
    if (!constructor) return null;
    const color = isUppercase(char) ? PieceColor.White : PieceColor.Black;
    return new constructor(color);
  }

  get isWhite() {
    return this.color === PieceColor.White;
  }
}
