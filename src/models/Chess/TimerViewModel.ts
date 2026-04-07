import { BaseViewModel } from '@/utils/BaseViewModel';
import type { TimerModel } from './TimerModel';
import type { ChessColor } from './types';
import type { TimerData } from '@/components/Chess/TimerDisplay';

export class TimerViewModel extends BaseViewModel<{}> {
  constructor(protected timer: TimerModel) {
    super({});
    this.registerModel('timer', timer);
  }

  public getTimerData(color: ChessColor): TimerData {
    const state = this.timer.getState();
    const time = color === 'white' ? state.whiteTime : state.blackTime;

    return {
      isActive: state.activeColor === color,
      time: this.formatTime(time),
      label: color === 'white' ? 'White' : 'Black',
      isLow: time < 1000 * 30,
    };
  }

  protected formatTime(time: number): string {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);

    return `${this.padTime(minutes)}:${this.padTime(seconds)}`;
  }

  protected padTime(time: number): string {
    return time.toString().padStart(2, '0');
  }
}
