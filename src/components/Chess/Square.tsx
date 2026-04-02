import { cn } from '@/utils/string';

interface SquareProps {
  label?: number;
  hasMark?: boolean;
  isHighlighted?: boolean;
  isSelected?: boolean;
}

export default function Square(props: SquareProps) {
  const { label, hasMark, isHighlighted, isSelected } = props;

  const classes = cn('chess-board-square', {
    'is-highlighted': isHighlighted,
    'is-selected': isSelected,
  });

  return (
    <div class={classes}>
      <div class='chess-board-square__label'>{label}</div>
      {hasMark && <div class='chess-board-square__mark absolute-center' />}
    </div>
  );
}
