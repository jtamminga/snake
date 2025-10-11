export class Effect {

  protected _duration?: number | undefined
  protected _updates: number

  public constructor(args: EffectArgs) {
    this._duration = args.duration
    this._updates = 0
  }

  public get duration(): number | undefined {
    return this._duration
  }

  public get remaining(): number | undefined {
    return this._duration === undefined
      ? undefined
      : this._duration - this._updates
  }

  public get expired(): boolean {
    return this._duration !== undefined && this._updates >= this._duration
  }

  public update(): void {
    this._updates += 1
  }

}


export type EffectArgs = {
  duration?: number
}