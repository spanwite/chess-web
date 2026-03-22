type NestedArray<T> = Array<T | NestedArray<T>>;

type CnValue = string | null | undefined | number | boolean;
type CnClass = string | number;
type CnRecord = Record<CnClass, CnValue>;

export type CnInput = CnValue | CnRecord | NestedArray<CnValue | CnRecord>;

export function cn(...inputs: CnInput[]): string {
  const classes: CnClass[] = [];
  // @ts-ignore
  const flatInputs = inputs.flat(100);
  for (const input of flatInputs) {
    if (!input) continue;
    if (typeof input === 'object') {
      for (const key in input) {
        if (!input[key]) continue;
        classes.push(key);
      }
      continue;
    }
    classes.push(input);
  }
  return classes.join(' ');
}
