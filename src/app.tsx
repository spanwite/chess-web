import { useMemo } from 'preact/hooks';
import { Board as BoardModel } from './models/Board';
import { Board } from './components/Board';

export function App() {
  const board = useMemo(() => new BoardModel(), []);

  return <Board model={board} />;
}
