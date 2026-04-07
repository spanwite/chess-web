import { BaseModel } from '@/utils/BaseModel';
import type { ChessColor } from './types';

export interface TimerModelState {
  whiteTime: number;
  blackTime: number;
  activeColor: ChessColor | null;
  timeoutColor: ChessColor | null;
}

type TimeoutCallback = (color: ChessColor) => void;

export class TimerModel extends BaseModel<TimerModelState> {
  protected intervalId: number | null = null;
  protected onTimeout: TimeoutCallback = () => {};

  constructor(protected initialTime: number) {
    super({
      whiteTime: initialTime,
      blackTime: initialTime,
      activeColor: null,
      timeoutColor: null,
    });
  }

  public start(color: ChessColor) {
    const { state } = this;

    if (color === state.activeColor) {
      return;
    }
    this.clearInterval();

    const activeTimeKey = color === 'white' ? 'whiteTime' : 'blackTime';
    const endTime = Date.now() + state[activeTimeKey];

    this.intervalId = setInterval(() => {
      this.setState({
        [activeTimeKey]: endTime - Date.now(),
      });
    }, 100);

    this.setState({ activeColor: color });
  }

  public pause() {
    this.setState({ activeColor: null });
    this.clearInterval();
  }

  public reset() {
    this.setState({
      whiteTime: this.initialTime,
      blackTime: this.initialTime,
      activeColor: null,
      timeoutColor: null,
    });
  }

  public setOnTimeout(callback: TimeoutCallback): void {
    this.onTimeout = callback;
  }

  protected checkTimeout() {
    const { state } = this;

    let timeoutColor: ChessColor | null = null;
    if (state.whiteTime <= 0) {
      timeoutColor = 'white';
    } else if (state.blackTime <= 0) {
      timeoutColor = 'black';
    }

    if (timeoutColor) {
      this.setState({ timeoutColor });
      this.onTimeout(timeoutColor);
      this.clearInterval();
    }
  }

  protected clearInterval() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
