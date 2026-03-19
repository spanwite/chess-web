import { useMemo } from 'preact/hooks';
import { Board } from './models/Board';

export function App() {
  const board = useMemo(() => new Board(), []);

  return <div>helloWorld</div>;
}
