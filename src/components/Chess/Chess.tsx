import type { Chess as ChessModel } from '@/models/Chess';
import Board from './Board';
import { BoardViewModel } from '@/viewmodels/Chess/Board';
import { useMemo } from 'preact/hooks';

export interface ChessProps {
  model: ChessModel;
}

export default function Chess(props: ChessProps) {
  const { model } = props;
  const board = useMemo(() => new BoardViewModel(model), [model]);

  return (
    <>
      <Board model={board} />
    </>
  );
}
