import { State } from './State.js'


export class Event<T> extends State<T | undefined> {

  public constructor(value?: T) {
    super(value)
  }

  public override changed(callback: (value: T | undefined) => void): void {
    super.changed(callback)
    this._preState = undefined
    this._curState = undefined
  }

  public override changedTo(state: T | undefined): boolean {
    const result = super.changedTo(state)
    if (result) {
      this._preState = undefined
      this._curState = undefined
    }
    return result
  }

}