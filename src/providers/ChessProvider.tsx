import { ChessContext } from '@/context/ChessContext';
import {
  ChessViewModel,
  GameViewModel,
  TimerModel,
  ChessModel,
  TimerViewModel,
} from '@/models/Chess';
import type { ComponentChildren } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';

interface ChessProviderProps {
  children: ComponentChildren;
}

export default function ChessProvider({ children }: ChessProviderProps) {
  const viewModels = useMemo(() => {
    const chessModel = new ChessModel();
    const timerModel = new TimerModel(1000 * 60 * 5);

    const chessViewModel = new ChessViewModel(chessModel);
    const gameViewModel = new GameViewModel(chessModel, timerModel);
    const timerViewModel = new TimerViewModel(timerModel);

    return {
      chess: chessViewModel,
      game: gameViewModel,
      timer: timerViewModel,
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(viewModels).forEach((viewModel) => {
        viewModel.dispose();
      });
    };
  }, [viewModels]);

  return (
    <ChessContext.Provider value={viewModels}>{children}</ChessContext.Provider>
  );
}
