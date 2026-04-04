import type { Square } from '@/models/Board';
import type { Chess } from '@/models/Chess';
import type { Piece } from '@/models/Piece';
import { ViewModel } from '@/utils/ViewModel';

export class BoardViewModel extends ViewModel {
  protected chess: Chess;

  private _selectedSquare = -1;

  constructor(chess: Chess) {
    super();
    this.chess = chess;
  }

  public get squares(): number[] {
    return this.chess.squares.map((_, index) => index);
  }

  public get pieces(): Piece[] {
    return this.chess.squares
      .filter((square) => square !== null)
      .sort((a, b) => a.initialIndex - b.initialIndex);
  }

  public get selectedSquare(): number {
    return this._selectedSquare;
  }

  public selectSquare = (index: number) => {
    const { chess, selectedSquare } = this;
    const targetPiece = chess.getSquare(index);

    if (targetPiece && targetPiece.color === chess.turn) {
      this.setSelectedSquare(index === selectedSquare ? -1 : index);
    } else if (selectedSquare >= 0) {
      chess.move(selectedSquare, index);
      this.setSelectedSquare(-1);
    }
  };

  public handleSquaresClick = (event: MouseEvent) => {
    const { chess } = this;

    const square = event.target as HTMLElement;
    const container = square.parentElement as HTMLElement;

    const { x, y } = container.getBoundingClientRect();
    const { left, top, width } = square.getBoundingClientRect();
    const squareX = Math.round((left - x) / width);
    const squareY = Math.round((top - y) / width);

    const index = chess.getIndexOf(squareX, squareY);

    this.selectSquare(index);
  };

  public getSquareProps(index: number) {
    const hasPiece = this.chess.getSquare(index) !== null;
    const isSelected = this.selectedSquare === index;
    const isAvailable = this.chess.canMove(this.selectedSquare, index);

    return {
      isSelected,
      isHighlighted: hasPiece && isAvailable,
      hasMark: !hasPiece && isAvailable,
      label: index,
    };
  }

  public getPieceProps(piece: Piece) {
    const [x, y] = piece.getCoordinates();

    return {
      x,
      y,
      color: piece.color,
      name: piece.name,
    };
  }

  protected setSelectedSquare(index: number) {
    this._selectedSquare = index;
    this.notify();
  }
}
