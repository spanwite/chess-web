import type { PieceColor, PieceName } from '@/modules/Chess';
import type { HTMLAttributes, Key } from 'preact';

export interface PieceData {
  x: number;
  y: number;
  color: PieceColor;
  name: PieceName;
  key?: Key;
}

type Props = PieceData & HTMLAttributes<HTMLSpanElement>;

export default function Piece(props: Props) {
  const { x, y, color, name, key, ...restProps } = props;

  const styles = `translate: ${x * 100}% ${y * 100}%`;

  return (
    <span class='chess-board-piece ' style={styles} {...restProps} key={key}>
      <img src={`public/pieces/${color}-${name}.svg`} />
    </span>
  );
}
