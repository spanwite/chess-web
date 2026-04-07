import type {
  ChessViewModel,
  GameViewModel,
  TimerViewModel,
} from '@/models/Chess';
import { createContext } from 'preact';

export interface ChessViewModels {
  chess: ChessViewModel;
  game: GameViewModel;
  timer: TimerViewModel;
}

export const ChessContext = createContext<ChessViewModels | null>(null);
