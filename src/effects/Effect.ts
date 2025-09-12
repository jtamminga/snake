export class Effect {

  protected _duration: number
  protected _updates: number

  public constructor(args: EffectArgs) {
    this._duration = args.duration
    this._updates = 0
  }

  public get duration(): number {
    return this._duration
  }

  public get expired(): boolean {
    return this._updates >= this._duration
  }

  public get remaining(): number {
    return this._duration - this._updates
  }

  public update(): void {
    this._updates += 1
  }

}


export type EffectArgs = {
  duration: number
}