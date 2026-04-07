import type { ChessViewModel } from '@/models/Chess/ChessViewModel';
import { createContext } from 'preact';

export interface ChessViewModels {
  chess: ChessViewModel;
}

export const ChessContext = createContext<ChessViewModels | null>(null);
