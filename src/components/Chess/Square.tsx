import { cn } from '@/utils/string';
import type { HTMLAttributes, Key } from 'preact';

export interface SquareData {
  index: number;
  hasPiece: boolean;
  isAvailable: boolean;
  isSelected: boolean;
  key?: Key;
}

type SquareProps = SquareData & HTMLAttributes<HTMLDivElement>;

export default function Square(props: SquareProps) {
  const { index, isAvailable, isSelected, hasPiece, key, ...restProps } = props;

  const classes = cn('chess-board-square', {
    'is-selected': isSelected,
    'is-available': isAvailable && hasPiece,
  });

  return (
    <div class={classes} {...restProps} key={key}>
      <div class='chess-board-square__index'>{index}</div>
      {isAvailable && !hasPiece && (
        <div class='chess-board-square__bullet absolute-center' />
      )}
    </div>
  );
}
