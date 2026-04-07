import Board from './Board';
import { useChess } from '@/hooks/useChess';
import TimerContainer from './TimerContainer';

export default function Game() {
  const { chess, timer } = useChess();

  return (
    <div class='chess-game'>
      <TimerContainer viewModel={timer} />
      <Board viewModel={chess} />
    </div>
  );
}
