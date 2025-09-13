import type { Effect } from './Effect.js'
import { GrowthEffect } from './GrowthEffect.js'
import { WrapEffect } from './WrapEffect.js'
import { SpeedBoostEffect } from './SpeedBoostEffect.js'


export class Effects {

  // Originally had an array of effects, but it ended up being so many array searches
  // that it ended up just being faster to do it this way. Also there isn't any
  // complicated effect stacking so I don't even need to hang on to multiple instance
  // of an effect "type"

  private _wrap: WrapEffect | undefined
  private _growth: GrowthEffect | undefined
  private _speedBoost: SpeedBoostEffect | undefined

  public constructor() {
  }

  public get all(): ReadonlyArray<Effect> {
    return [this._wrap, this._speedBoost, this._growth]
      .filter(effect => effect !== undefined)
  }

  public get growth(): GrowthEffect | undefined {
    return this._growth
  }

  public get wrap(): WrapEffect | undefined {
    return this._wrap
  }

  public get speedBoost(): SpeedBoostEffect | undefined {
    return this._speedBoost
  }

  public add(effects: ReadonlyArray<Effect>): void {
    effects.forEach(effect => this.addEffect(effect))
  }

  public update(): void {
    
    // update growth
    if (this._growth) {
      this._growth.update()
      if (this._growth.expired) this._growth = undefined
    }

    // update wrap
    if (this._wrap) {
      this._wrap.update()
      if (this._wrap.expired) this._wrap = undefined
    }

    // update speedboost
    if (this._speedBoost) {
      this._speedBoost.update()
      if (this._speedBoost.expired) this._speedBoost = undefined
    }
  }

  private addEffect(effect: Effect): void {

    // single instance (increases duration of active)
    if (effect instanceof GrowthEffect) {
      if (this._growth) {
        this._growth.addDuration(effect.duration)
      } else {
        this._growth = effect
      }
    }

    // replaces active
    else if (effect instanceof WrapEffect) {
      this._wrap = effect
    }

    // replaces active
    else if (effect instanceof SpeedBoostEffect) {
      this._speedBoost = effect
    }
  }

}