import { BaseModel } from './BaseModel';

export class BaseViewModel<State extends object> extends BaseModel<State> {
  protected models: Map<string, BaseModel<any>> = new Map();

  protected registerModel(name: string, model: BaseModel<any>): void {
    this.models.set(name, model);

    model.subscribe(() => this.onModelChange(name, model));
  }

  protected onModelChange(key: string, model: BaseModel<any>): void {
    this.notify();
  }

  public override dispose(): void {
    this.models.clear();
    super.dispose();
  }
}
