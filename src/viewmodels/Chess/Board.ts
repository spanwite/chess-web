import type { Square } from '@/models/Board';
import type { Chess } from '@/models/Chess';
import { ViewModel } from '@/utils/ViewModel';

export interface ChessState {
  selectedSquare: number;
}

export class BoardViewModel extends ViewModel<ChessState> {
  protected chess: Chess;

  constructor(chess: Chess) {
    super({ selectedSquare: -1 });
    this.chess = chess;
  }

  get squares(): Square[] {
    return this.chess.squares;
  }

  selectSquare = (index: number) => {
    const { chess, state } = this;
    const targetPiece = chess.getSquare(index);

    if (targetPiece && targetPiece.color === chess.turn) {
      this.setSelectedSquare(index === state.selectedSquare ? -1 : index);
    } else if (state.selectedSquare >= 0) {
      chess.move(state.selectedSquare, index);
      this.setSelectedSquare(-1);
    }
  };

  handleSquaresClick = (event: MouseEvent) => {
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

  hasPieceAt = (index: number): boolean => {
    return this.chess.getSquare(index) !== null;
  };

  canMove = (fromIndex: number, toIndex: number): boolean => {
    return this.chess.canMove(fromIndex, toIndex);
  };

  protected setSelectedSquare(index: number) {
    this.setState({
      selectedSquare: index,
    });
  }
}
