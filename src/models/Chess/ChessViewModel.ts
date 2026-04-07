import { BaseViewModel } from '@/utils/BaseViewModel';
import type { ChessModel } from './ChessModel';
import type { Piece } from '@/modules/Chess';
import type { PieceData } from '@/components/Chess/Piece';
import type { SquareData } from '@/components/Chess/Square';
import type { BaseModel } from '@/utils/BaseModel';

interface ChessViewModelState {
  selectedSquare: number;
  pieces: PieceData[];
}

export class ChessViewModel extends BaseViewModel<ChessViewModelState> {
  protected chess: ChessModel;

  constructor(chess: ChessModel) {
    super({ selectedSquare: -1, pieces: [] });
    this.chess = chess;
    this.registerModel('chess', chess);
    this.updatePieces();
  }

  protected onModelChange(): void {
    this.updatePieces();
  }

  protected updatePieces(): void {
    this.setState({ pieces: this.getPiecesData() });
  }

  public getSquaresData(): SquareData[] {
    return this.chess.squares.map((_, index) => this.getSquareData(index));
  }

  protected getPiecesData(): PieceData[] {
    return this.chess.squares
      .filter((square) => square !== null)
      .map((square) => this.getPieceData(square))
      .sort((a, b) => a.key - b.key);
  }

  public handleSquareClick(square: number): void {
    const {
      chess,
      state: { selectedSquare },
    } = this;

    const targetPiece = chess.getSquare(square);

    if (selectedSquare >= 0) {
      const hasMoved = chess.tryMove(selectedSquare, square);
      if (hasMoved) {
        this.clearSelection();
        return;
      }
    }
    if (!targetPiece || targetPiece.index === selectedSquare) {
      this.clearSelection();
      return;
    }
    if (targetPiece.color === chess.getState().turn) {
      this.selectSquare(square);
    }
  }

  protected getSquareData(square: number): SquareData {
    const hasPiece = this.chess.getSquare(square) !== null;
    const isSelected = this.state.selectedSquare === square;
    const isAvailable = this.chess.canMove(this.state.selectedSquare, square);
    return { index: square, hasPiece, isAvailable, isSelected, key: square };
  }

  protected getPieceData(piece: Piece): PieceData {
    return {
      x: piece.getX(),
      y: piece.getY(),
      color: piece.color,
      name: piece.name,
      key: piece.initialIndex,
    };
  }

  protected clearSelection(): void {
    this.selectSquare(-1);
  }

  protected selectSquare(square: number): void {
    this.setState({ selectedSquare: square });
  }
}
