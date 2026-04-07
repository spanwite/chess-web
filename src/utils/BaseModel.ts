export type Listener<T> = (state: T) => void;

export abstract class BaseModel<State extends object> {
  protected state: State;
  private listeners = new Set<Listener<State>>();
  private isDisposed = false;

  constructor(initialState: State) {
    this.state = initialState;
  }

  public getState(): Readonly<State> {
    return this.state;
  }

  protected setState(updates: Partial<State>): void {
    if (this.isDisposed) {
      return;
    }
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  public subscribe(listener: Listener<State>): () => void {
    if (this.isDisposed) {
      return () => {};
    }
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  protected notify(): void {
    this.listeners.forEach((callback) => callback(this.state));
  }

  public dispose(): void {
    this.isDisposed = true;
    this.listeners.clear();
  }
}
