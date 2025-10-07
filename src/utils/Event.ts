import { State } from './State.js'


export class Event<T> extends State<T | undefined> {

  public constructor(value?: T) {
    super(value)
  }

  public flush(): void {
    this._curState = undefined
    this._preState = undefined
  }

}