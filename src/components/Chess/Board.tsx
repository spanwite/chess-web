import type { ChessViewModel } from '@/models/Chess/ChessViewModel';
import Piece from './Piece';
import Square from './Square';
import { useModel } from '@/hooks/useModel';

export interface BoardProps {
  viewModel: ChessViewModel;
}

export default function Board({ viewModel }: BoardProps) {
  useModel(viewModel);
  const state = viewModel.getState();

  return (
    <div class='chess-board'>
      <div class='chess-board__squares'>
        {viewModel.getSquaresData().map(({ key, ...square }) => (
          <Square
            {...square}
            onMouseDown={() => viewModel.handleSquareClick(square.index)}
            key={key}
          />
        ))}
      </div>
      <div class='chess-board__pieces'>
        {state.pieces.map(({ key, ...piece }) => (
          <Piece {...piece} key={key} />
        ))}
      </div>
    </div>
  );
}
