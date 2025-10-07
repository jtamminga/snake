export class State<T> {

  protected _preState: T
  protected _curState: T

  public constructor(initial: T) {
    this._preState = initial
    this._curState = initial
  }

  public get previous(): T {
    return this._preState
  }

  public get current(): T {
    return this._curState
  }

  public changed(callback: (value: T) => void): void {
    if (this._preState !== this._curState) {
      callback(this._curState)
    }
  }

  public changedTo(state: T): boolean {
    return this._curState === state && this._preState !== state
  }

  public update(state: T): void {
    this._preState = this._curState
    this._curState = state
  }

}