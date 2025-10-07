import { Layer, type LayerArgs } from './layers/index.js'
import type { Snake } from './Snake.js'
import { Input, Event } from './utils/index.js'


export class ShopMenu extends Layer<boolean> {

  private _middle: number
  private _items: ShopItem[]
  private _itemIndex: number
  
  public constructor(args: ShopMenuArgs) {
    super(args, false)
    this._middle = args.width / 2
    this._itemIndex = 0
    this._items = [
      { name: 'Speed reduction', cost: 1 },
      { name: 'Teleporter', cost: 5 },
    ]
  }

  public update(input: Input): number {
    if (input.lastKey.consume('up')) {
      this._itemIndex -= 1
    }
    else if (input.lastKey.consume('down')) {
      this._itemIndex += 1
    }
    else if (input.lastKey.consume('esc')) {
      this.resolve(true)
    }

    // 30 fps
    return 1000 / 30
  }

  public render(): void {
    const canvas = this._canvas

    canvas.fillStyle = 'rgba(255, 217, 0, 0.7)'
    canvas.fillRect(0, 0, this._width, this._height)

    canvas.font = '100px Tiny5'
    canvas.fillStyle = 'rgba(0, 0, 0, 1)'
    canvas.fillText('shop', this._middle, 100)

    canvas.font = '50px Tiny5'
    for (let i = 0; i < this._items.length; i++) {
      const item = this._items[i]!
      const isActive = this._itemIndex === i
      canvas.fillText(isActive ? `> ${item.name} <` : item.name, this._middle, (i * 50) + 200)
    }
  }

}


type ShopMenuArgs = LayerArgs & {
  snake: Snake
}
type ShopItem = {
  name: string
  cost: number
}