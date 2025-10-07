import { State } from './State.js'


export class Event<T> extends State<T | undefined> {

  public constructor(value?: T) {
    super(value)
  }

  public consume(value: T): boolean {
    const result = this.changedTo(value)

    if (result) {
      this._curState = undefined
      this._preState = undefined
    }

    return result
  }

}