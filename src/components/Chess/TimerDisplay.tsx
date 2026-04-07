import { cn } from '@/utils/string';

export interface TimerData {
  label: string;
  time: string;
  isActive: boolean;
  isLow: boolean;
}

type TimerDisplayProps = TimerData;

export default function TimerDisplay({
  time,
  label,
  isActive,
  isLow,
}: TimerDisplayProps) {
  return (
    <div
      class={cn('chess-timer-display', {
        'is-active': isActive,
        'is-low': isLow,
      })}
    >
      <span class='chess-timer-display__label'>{label} </span>
      <span class='chess-timer-display__value'>{time}</span>
    </div>
  );
}
