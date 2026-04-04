export type Listener = () => void;

export abstract class ViewModel {
  private listeners = new Set<Listener>();

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public dispose(): void {
    this.listeners.clear();
  }

  protected notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}
