import { Chess } from '@/modules/Chess';
import type { Square } from '@/modules/Chess/Board';
import { BaseModel } from '@/utils/BaseModel';
import type { ChessColor } from './types';

export interface ChessModelState {
  turn: ChessColor;
  fen: string;
}

export class ChessModel extends BaseModel<ChessModelState> {
  protected chess: Chess;

  constructor() {
    super({
      turn: 'white',
      fen: '',
    });
    this.chess = new Chess();
    this.setFen(Chess.initialFen);
  }

  public setFen(fen: string) {
    this.chess.loadFEN(fen);
    this.syncState();
  }

  public get squares() {
    return this.chess.squares;
  }

  public tryMove(fromIndex: number, toIndex: number) {
    const isSuccess = this.chess.move(fromIndex, toIndex);
    if (isSuccess) {
      this.syncState();
    }
    return isSuccess;
  }

  public getMoves(fromIndex: number) {
    return this.chess.getMoves(fromIndex);
  }

  public canMove(fromIndex: number, toIndex: number) {
    return this.chess.canMove(fromIndex, toIndex);
  }

  public getSquare(index: number): Square {
    return this.chess.getSquare(index);
  }

  protected syncState() {
    this.setState({
      turn: this.chess.turn,
    });
  }
}
