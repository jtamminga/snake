import type { Effect } from './Effect.js'
import { GrowthEffect } from './GrowthEffect.js'
import { WrapEffect } from './WrapEffect.js'
import { SpeedBoostEffect } from './SpeedBoostEffect.js'


export class Effects {

  private _wrap: WrapEffect | undefined
  private _growth: GrowthEffect | undefined
  private _speedBoosts: SpeedBoostEffect[]

  public constructor() {
    this._speedBoosts = []
  }

  public get all(): ReadonlyArray<Effect> {
    return [this._wrap, ...this._speedBoosts, this._growth]
      .filter(effect => effect !== undefined)
  }

  public get growth(): GrowthEffect | undefined {
    return this._growth
  }

  public get wrap(): WrapEffect | undefined {
    return this._wrap
  }

  public get speedBoosts(): ReadonlyArray<SpeedBoostEffect> {
    return this._speedBoosts
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

    // update speedboosts
    this._speedBoosts.forEach(boost => boost.update())
    this._speedBoosts = this._speedBoosts.filter(boost => !boost.expired)
  }

  private addEffect(effect: Effect): void {

    // always single effect (increases duration of active)
    if (effect instanceof GrowthEffect) {
      if (this._growth) {
        this._growth.addDuration(effect.duration)
      } else {
        this._growth = effect
      }
    }

    // replaces active if one active
    else if (effect instanceof WrapEffect) {
      this._wrap = effect
    }

    // fully stacking effect
    else if (effect instanceof SpeedBoostEffect) {
      this._speedBoosts.push(effect)
    }
  }

}