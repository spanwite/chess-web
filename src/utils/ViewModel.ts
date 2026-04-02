export type Listener<T> = (state: T) => void;

export abstract class ViewModel<State extends object> {
  protected _state: State;
  private listeners = new Set<Listener<State>>();

  constructor(initialState: State) {
    this._state = initialState;
  }

  get state(): Readonly<State> {
    return this._state;
  }

  protected setState(updates: Partial<State>): void {
    this._state = { ...this._state, ...updates };
    this.notify();
  }

  subscribe(listener: Listener<State>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  dispose(): void {
    this.listeners.clear();
  }
}
