export function generateId(): string {
  return Math.random().toString().substring(2, 9);
}
