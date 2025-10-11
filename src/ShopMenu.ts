import type { BreedUpgrade } from './breed/index.js'
import { Layer, type LayerArgs } from './layers/index.js'
import type { Snake } from './Snake.js'
import { type UpgradeData } from './upgrades/index.js'
import { getLines, Input } from './utils/index.js'


export class ShopMenu extends Layer<boolean> {

  private _snake: Snake
  private _middle: number
  private _items: ReadonlyArray<UpgradeData<BreedUpgrade>>
  private _itemIndex: number
  
  public constructor(args: ShopMenuArgs) {
    super(args, false)
    this._snake = args.snake
    this._middle = args.width / 2
    this._itemIndex = 0
    this._items = this._snake.breed.upgrades
  }

  public update(input: Input): number {
    if (input.lastKey.consume('up')) {
      if (this._itemIndex > 0) {
        this._itemIndex -= 1
      } 
    }
    else if (input.lastKey.consume('down')) {
      if (this._itemIndex < this._items.length - 1) {
        this._itemIndex += 1
      }
    }
    else if (input.lastKey.consume('enter')) {
      const item = this._items[this._itemIndex]
      if (item && item.available && item.cost <= this._snake.gold) {
        this._snake.upgrade(item.id)
      }
    }
    else if (input.lastKey.consume('esc')) {
      this.resolve(true)
    }

    // 30 fps
    return 1000 / 30
  }

  public render(): void {
    const canvas = this._canvas

    canvas.fillStyle = 'rgba(255, 217, 0, 0.8)'
    canvas.fillRect(0, 0, this._width, this._height)

    canvas.font = '100px Tiny5'
    canvas.fillStyle = 'rgba(0, 0, 0, 1)'
    canvas.fillText('shop', this._middle, 100)

    // render upgrades
    canvas.font = '50px Tiny5'
    for (let i = 0; i < this._items.length; i++) {
      const item = this._items[i]!
      const isActive = this._itemIndex === i
      canvas.fillStyle = item.available
        ? item.cost > this._snake.gold
          ? 'rgba(160, 0, 0, 1)'
          : 'rgba(0, 0, 0, 1)'
        : 'rgba(0, 0, 0, 0.4)'
      canvas.fillText(isActive ? `> ${item.name} <` : item.name, this._middle, (i * 50) + 200)
    }

    // render description
    const selectedItem = this._items[this._itemIndex]!
    canvas.font = '30px Tiny5'
    canvas.fillStyle = 'rgba(0, 0, 0, 0.6)'
    const lines = getLines(canvas, selectedItem.description + ` (${selectedItem.cost}g)`, this._width / 2)
    for (let i = 0; i < lines.length; i++) {
      canvas.fillText(lines[i]!, this._middle, (i * 30) + 500)
    }
  }

}


type ShopMenuArgs = LayerArgs & {
  snake: Snake
}