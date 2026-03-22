import type { Board as BoardModel } from '@/models/Board';
import { Piece } from '@/models/Piece';
import { useMemo, useState } from 'preact/hooks';
import { cn } from '@/utils/string';
import type { Position } from '@/models/Piece/Piece';

export function Board({ model: board }: { model: BoardModel }) {
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

  const legalMoves: number[] = useMemo(() => {
    return selectedPiece?.getLegalMoves() || [];
  }, [selectedPiece]);

  // const handleSquareClick = (index: number) => {
  //   const piece = board.pieceAt(index);
  //   if (legalMoves.includes(index)) {
  //     board.movePiece(selectedPiece, index);
  //     setSelectedPiece(null);
  //   } else if (piece === selectedPiece) {
  //     setSelectedPiece(null);
  //   } else {
  //     setSelectedPiece(piece);
  //   }
  // };

  // const squaress = board.squares.map((square, index) => {
  //   const isAvailable = legalMoves.includes(index);
  //   const isSelected = board.indexOf(selectedPiece) === index;
  //   const isPiece = square !== null;
  //
  //   // console.log('🚀 availableSquares:', availableSquares);
  //
  //   const classes = cn('square', {
  //     'is-selected': isSelected,
  //     'is-available': isPiece && isAvailable,
  //   });
  //
  //   return (
  //     <div class={classes} onClick={() => handleSquareClick(index)}>
  //       {isAvailable && !isPiece && <div class='square-mark absolute-center' />}
  //       <span class='square-index'>{index}</span>
  //       {isPiece && (
  //         <img
  //           src={`public/figures/${square.color}-${square.name}.svg`}
  //           class='absolute-center'
  //         />
  //       )}
  //     </div>
  //   );
  // });

  const handleSquareClick = (event: MouseEvent) => {
    const square = event.target as HTMLElement;
    const container = square.parentElement as HTMLElement;

    const { x, y } = container.getBoundingClientRect();
    const { left, top, width } = square.getBoundingClientRect();
    const squareX = Math.round((left - x) / width);
    const squareY = Math.round((top - y) / width);

    const index = board.indexOf(squareX, squareY);
    const piece = board.pieceAt(index);

    // Right button
    if (event.button === 2) {
      event.preventDefault();
      setSelectedPiece(null);
      return;
    }

    if (piece === selectedPiece) {
      setSelectedPiece(null);
    } else if (selectedPiece && legalMoves.includes(index)) {
      board.movePiece(selectedPiece, index);
      setSelectedPiece(null);
    } else {
      setSelectedPiece(piece);
    }
  };

  const $squares = board.squares.map((_, index) => {
    const isSelected = selectedPiece?.index === index;
    const isAvailable = legalMoves.includes(index);
    const hasPiece = board.pieceAt(index) !== null;

    const classes = cn('square', {
      'is-selected': isSelected,
      'is-available': hasPiece && isAvailable,
    });

    return (
      <div class={classes}>
        {isAvailable && !hasPiece && (
          <div class='square-mark absolute-center' />
        )}
      </div>
    );
  });

  const $pieces = board.getPiecesArray().map((piece) => {
    const { x, y } = piece.getCoordinates();
    const translateX = `${x * 100}%`;
    const translateY = `${y * 100}%`;

    return (
      <span
        class='piece'
        style={`translate: ${translateX} ${translateY}`}
        key={piece.id}
      >
        <img src={`public/figures/${piece.color}-${piece.name}.svg`} />
      </span>
    );
  });

  return (
    <div class='board'>
      <div class='squares' onMouseDown={handleSquareClick}>
        {$squares}
      </div>
      <div class='pieces'>{$pieces}</div>
    </div>
  );
}
