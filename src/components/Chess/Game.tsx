import Board from './Board';
import { useChess } from '@/hooks/useChess';

export default function Game() {
  const { chess } = useChess();

  return (
    <div>
      <Board viewModel={chess} />
    </div>
  );
}
