import type { Board as BoardModel } from '@/models/Board';
import { Piece } from '@/models/Piece';
import { useMemo, useState } from 'preact/hooks';
import { cn } from '@/utils/string';

export function Board({ model: board }: { model: BoardModel }) {
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

  const legalMoves: number[] = useMemo(() => {
    return selectedPiece?.getLegalMoves() || [];
  }, [selectedPiece]);

  const handleSquareClick = (index: number) => {
    const piece = board.pieceAt(index);

    if (legalMoves.includes(index)) {
      board.movePiece(selectedPiece, index);
      setSelectedPiece(null);
    } else if (piece === selectedPiece) {
      setSelectedPiece(null);
    } else {
      setSelectedPiece(piece);
    }
  };

  const squares = board.squares.map((square, index) => {
    const isAvailable = legalMoves.includes(index);
    const isSelected = board.indexOf(selectedPiece) === index;
    const isPiece = square !== null;

    // console.log('🚀 availableSquares:', availableSquares);

    const classes = cn('square', {
      'is-selected': isSelected,
      'is-available': isPiece && isAvailable,
    });

    return (
      <div class={classes} onClick={() => handleSquareClick(index)}>
        {isAvailable && !isPiece && <div class='square-mark absolute-center' />}
        <span class='square-index'>{index}</span>
        {isPiece && (
          <img
            src={`public/figures/${square.color}-${square.name}.svg`}
            class='absolute-center'
          />
        )}
      </div>
    );
  });

  return <div class='board'>{squares}</div>;
}
