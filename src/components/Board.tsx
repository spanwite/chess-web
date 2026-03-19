import type { Board as BoardModel } from '@/models/Board';
import { Piece } from '@/models/Piece';
import './Board.css';
import { useState } from 'preact/hooks';
import { cn } from '@/utils/string';

export function Board({ model: board }: { model: BoardModel }) {
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

  const selectPiece = (index: number) => {
    const piece = board.pieceAt(index);
    if (piece) {
      setSelectedPiece(piece);
    }
  };

  return (
    <div class='board'>
      {board.squares.map((square, index) => (
        <div
          class={cn(
            'cell',
            board.indexOf(selectedPiece) === index && 'is-selected'
          )}
          onClick={() => selectPiece(index)}
        >
          {square instanceof Piece && (
            <img src={`public/figures/${square.color}-${square.name}.svg`} />
          )}
        </div>
      ))}
    </div>
  );
}
