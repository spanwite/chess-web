import { ChessContext } from '@/context/ChessContext';
import { ChessModel } from '@/models/Chess/ChessModel';
import { ChessViewModel } from '@/models/Chess/ChessViewModel';
import type { ComponentChildren } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';

interface ChessProviderProps {
  children: ComponentChildren;
}

export default function ChessProvider({ children }: ChessProviderProps) {
  const viewModels = useMemo(() => {
    const chessModel = new ChessModel();
    const chessViewModel = new ChessViewModel(chessModel);

    return {
      chess: chessViewModel,
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
