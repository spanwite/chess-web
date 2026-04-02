import { Chess as ChessModel } from '@/models/Chess';
import Chess from './components/Chess';
import './styles/index.css';

const chess = new ChessModel();

export function App() {
  return <Chess model={chess} />;
}
