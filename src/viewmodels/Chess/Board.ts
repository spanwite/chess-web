import { Board } from '@/models/Board';
import { ViewModel } from '@/utils/ViewModel';

export interface ChessState {
  selectedSquare: number;
  availableMoves: number[];
}

export class BoardViewModel extends ViewModel<ChessState> {
  protected board: Board;

  constructor(board: Board) {
    super({ selectedSquare: -1, availableMoves: [] });
    this.board = board;
  }

  protected setSelectedSquare(index: number) {
    this.setState({
      selectedSquare: index,
      availableMoves: this.calculateAvailableMoves(index),
    });
  }

  protected calculateAvailableMoves(selectedSquare: number) {
    const selectedPiece = this.board.getPieceAt(selectedSquare);
    return selectedPiece?.getLegalMoves() || [];
  }

  getPieces = () => {
    return this.board.getPieces();
  };

  getSquares = () => {
    return this.board.squares;
  };

  selectSquare = (index: number) => {
    const { board, state } = this;
    const targetPiece = this.board.getPieceAt(index);
    const selectedPiece = this.board.getPieceAt(state.selectedSquare);

    if (targetPiece && targetPiece.color === board.turn) {
      this.setSelectedSquare(index === state.selectedSquare ? -1 : index);
    } else if (state.selectedSquare >= 0) {
      if (selectedPiece && state.availableMoves.includes(index)) {
        selectedPiece.move(index);
        board.switchTurn();
      }
      this.setSelectedSquare(-1);
    }
  };

  handleSquaresClick = (event: MouseEvent) => {
    const { board } = this;

    const square = event.target as HTMLElement;
    const container = square.parentElement as HTMLElement;

    const { x, y } = container.getBoundingClientRect();
    const { left, top, width } = square.getBoundingClientRect();
    const squareX = Math.round((left - x) / width);
    const squareY = Math.round((top - y) / width);

    const index = board.indexOf(squareX, squareY);

    this.selectSquare(index);
  };

  hasPieceAt = (index: number): boolean => {
    return this.board.getPieceAt(index) !== null;
  };
}
