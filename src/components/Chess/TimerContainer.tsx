import { useModel } from '@/hooks/useModel';
import type { TimerViewModel } from '@/models/Chess';
import TimerDisplay from './TimerDisplay';

interface TimerContainerProps {
  viewModel: TimerViewModel;
}

export default function TimerContainer({ viewModel }: TimerContainerProps) {
  useModel(viewModel);

  return (
    <div class='timer-container'>
      <TimerDisplay {...viewModel.getTimerData('black')} />
      <TimerDisplay {...viewModel.getTimerData('white')} />
    </div>
  );
}
