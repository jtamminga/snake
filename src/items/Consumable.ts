import type { Effect } from '../effects/index.js'
import { Item, type ItemArgs } from './Item.js'


export abstract class Consumable extends Item {

  protected _consumedAt: number | undefined

  public constructor(args: ItemArgs) {
    super(args)
  }

  public get consumed(): boolean {
    return this._consumedAt !== undefined
  }

  public override get exists(): boolean {
    return super.exists && this._consumedAt === undefined
  }

  public consume(): ReadonlyArray<Effect> {
    this._consumedAt = this._updates
    return this.effects()
  }

  protected abstract effects(): ReadonlyArray<Effect>

}