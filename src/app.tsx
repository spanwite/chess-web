import Game from './components/Chess';
import ChessProvider from './providers/ChessProvider';
import './styles/index.css';

export function App() {
  return (
    <ChessProvider>
      <Game />
    </ChessProvider>
  );
}
