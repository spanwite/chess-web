import { Board as ChessModel } from './models/Board.ts';
import Chess from './components/Chess';
import './styles/index.css';

const chess = new ChessModel();

export function App() {
  return <Chess model={chess} />;
}
