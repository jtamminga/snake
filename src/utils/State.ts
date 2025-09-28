export class State<T> {

  private _preState: T
  private _curState: T

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

  public changedTo(state: T): boolean {
    const result = this._curState === state && this._preState !== state
    this._preState = this._curState
    return result
  }

  public update(state: T): void {
    this._preState = this._curState
    this._curState = state
  }

}