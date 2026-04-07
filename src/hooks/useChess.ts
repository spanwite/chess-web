import { ChessContext } from '@/context/ChessContext';
import { useContext } from 'preact/hooks';

export function useChess() {
  const context = useContext(ChessContext);
  if (!context) {
    throw new Error('useChess must be used within a ChessProvider');
  }
  return context;
}
