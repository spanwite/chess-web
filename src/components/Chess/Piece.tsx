import type { PieceColor, PieceName } from '@/models/Piece';
import type { HTMLAttributes } from 'preact';

export interface PieceProps extends HTMLAttributes<HTMLSpanElement> {
  x: number;
  y: number;
  color: PieceColor;
  name: PieceName;
}

export default function Piece(props: PieceProps) {
  const { x, y, color, name, ...restProps } = props;

  const styles = `translate: ${x * 100}% ${y * 100}%`;

  return (
    <span class='chess-board-piece ' style={styles} {...restProps}>
      <img src={`public/pieces/${color}-${name}.svg`} />
    </span>
  );
}
