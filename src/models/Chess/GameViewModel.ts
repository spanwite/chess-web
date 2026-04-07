import { BaseViewModel } from '@/utils/BaseViewModel';
import type { ChessModel, ChessModelState } from './ChessModel';
import type { TimerModel, TimerModelState } from './TimerModel';
import type { ChessColor, ChessStatus } from './types';

type GameStatus = ChessStatus | 'timeout' | 'resign';

interface GameViewModelState {
  chess: ChessModelState;
  timer: TimerModelState;
  status: GameStatus;
  winner: ChessColor | null;
}

export class GameViewModel extends BaseViewModel<GameViewModelState> {
  constructor(
    protected chess: ChessModel,
    protected timer: TimerModel
  ) {
    super({
      chess: chess.getState(),
      timer: timer.getState(),
      status: 'playing',
      winner: null,
    });
    this.registerModel('chess', chess);
    this.registerModel('timer', timer);
    timer.setOnTimeout((color) => this.onTimeout(color));
  }

  get winnerMessage(): string {
    if (this.state.status === 'timeout') {
      return `Time's up! ${this.state.winner === 'white' ? 'White' : 'Black'} wins!`;
    }
    return '';
  }

  protected override onModelChange(key: string): void {
    const chessState = this.chess.getState();
    const timerState = this.timer.getState();

    if (key === 'chess') {
      if (this.state.status !== 'playing') {
        return;
      }

      this.timer.start(chessState.turn);

      this.setState({
        chess: chessState,
        timer: timerState,
      });
    }
  }

  protected onTimeout(color: ChessColor): void {
    this.setState({
      status: 'timeout',
      winner: color === 'white' ? 'black' : 'white',
    });
    this.timer.pause();
  }
}
