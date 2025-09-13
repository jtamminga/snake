import type { Effect } from '../effects/index.js'
import { Item, type ItemArgs } from './Item.js'


export abstract class Consumable extends Item {

  protected _consumed: boolean

  public constructor(args: ItemArgs) {
    super(args)
    this._consumed = false
  }

  public get consumed(): boolean {
    return this._consumed
  }

  public override get exists(): boolean {
    return super.exists && !this._consumed
  }

  public consume(): ReadonlyArray<Effect> {
    this._consumed = true
    return this.effects()
  }

  protected abstract effects(): ReadonlyArray<Effect>

}