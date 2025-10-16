import type { BreedType } from './breed/index.js'
import { Coin, Food, Stone } from './items/index.js'
import { Layer, type LayerArgs } from './layers/index.js'
import { Notifier } from './Notifier.js'
import type { Snake } from './Snake.js'
import { type Input, lerp, State } from './utils/index.js'
import { World } from './World.js'


export class Game extends Layer<GameOverReason> {

  private _state: State<GameState>
  private _numUpdates: number
  private _notifier: Notifier
  private _world: World

  private readonly _pxPadding = 3
  private readonly _pxSize = 100
  private readonly _halfPxSize = this._pxSize / 2
  private readonly _baseInterval = 500
  private readonly _snakeSpeedMult = 10

  public constructor(args: GameArgs) {
    super(args)

    this._state = new State('playing')
    this._numUpdates = 0
    this._notifier = new Notifier()
    this._world = new World({
      snakeBreed: args.snakeBreed,
      notifier: this._notifier,
      width: 8,
      height: 6
    })
  }

  public get state(): State<GameState> {
    return this._state
  }

  public get world(): World {
    return this._world
  }

  public get stats(): Stats {
    return {
      moves: this._numUpdates,
      snakeLength: this._world.snake.length,
      gold: this._world.snake.gold
    }
  }

  public update(input: Input): number {
    const {snake} = this._world

    this._notifier.update()
    this._world.update(input.direction)

    if (!snake.alive) {
      this._state.update('over')
      this.resolve('lost')
    }
    else if (snake.length === this._world.area) {
      this._state.update('won')
      this.resolve('won')
    }

    this._numUpdates += 1

    return this._baseInterval - (snake.speed * this._snakeSpeedMult)
  }

  public render(progress: number): void {

    // items
    for (const item of this._world.items) {
      if (item instanceof Coin) {
        this.renderCoin(item)
      }
      else if (item instanceof Food) {
        this.renderFood(item)
      }
      else if (item instanceof Stone) {
        this.renderStone(item, progress)
      }
    }

    // snake
    this.renderSnake(this._world.snake, progress)

    // notifications
    this.renderNotifications(this._notifier)
  }

  private renderCoin(coin: Coin): void {
    const canvas = this._canvas
    const pxSize = this._pxSize

    const radius = pxSize / 4
    const offset = (pxSize - (radius*2)) / 2 // for centering
    canvas.beginPath()
    canvas.ellipse(
      (coin.position.x * pxSize) + radius + offset,
      (coin.position.y * pxSize) + radius + offset,
      radius,
      radius,
      0, 0, 2 * Math.PI
    )
    canvas.fillStyle = 'rgba(255, 217, 0, 1)'
    canvas.fill()
    canvas.closePath()
  }

  private renderFood(food: Food): void {
    const canvas = this._canvas
    const pxSize = this._pxSize

    const foodSize = this._halfPxSize
    const offset = (pxSize - foodSize) / 2
    canvas.fillStyle = `rgba(255, 153, 0, 1)`
    canvas.fillRect(
      food.position.x * pxSize + offset,
      food.position.y * pxSize + offset,
      foodSize,
      foodSize
    )
  }

  private renderStone(stone: Stone, progress: number): void {
    const canvas = this._canvas
    const pxSize = this._pxSize
    const halfPxSize = this._halfPxSize

    canvas.fillStyle = `rgba(70, 70, 70, ${stone.spawning ? '0.3' : '1'})`
    canvas.fillRect(
      lerp(stone.prePosition.x * pxSize, stone.position.x * pxSize, progress),
      lerp(stone.prePosition.y * pxSize, stone.position.y * pxSize, progress),
      pxSize,
      pxSize
    )

    if (stone.spawning) {
      canvas.font = '50px Tiny5'
      canvas.fillStyle = `rgba(255, 255, 255, 0.1)`
      canvas.fillText(
        stone.updatesTillSpawn.toString(),
        stone.position.x * pxSize + halfPxSize + 2,
        stone.position.y * pxSize + halfPxSize
      )
    }
  }

  private renderSnake(snake: Snake, progress: number): void {
    const canvas = this._canvas
    const pxSize = this._pxSize
    const halfPxSize = this._halfPxSize

    const preTail = snake.preTail
    const curTail = snake.tail
    const curHead = snake.head
    const preHead = snake.length > 1
      ? snake.segments[1]!
      : preTail

    const headX = lerp(preHead.x * pxSize, curHead.x * pxSize, progress)
    const headY = lerp(preHead.y * pxSize, curHead.y * pxSize, progress)

    canvas.fillStyle = snake.alive
      ? snake.effects.rockEater
        ? 'rgba(255, 217, 0, 1)'
        : 'green'
      : 'red'

    // tail
    canvas.fillRect(
      lerp(preTail.x * pxSize, curTail.x * pxSize, progress),
      lerp(preTail.y * pxSize, curTail.y * pxSize, progress),
      pxSize,
      pxSize
    )

    // body (minus head)
    for (let i = 1; i < snake.length; i++) {
      const seg = snake.segments[i]!
      canvas.fillRect(
        seg.x * pxSize ,
        seg.y * pxSize,
        pxSize,
        pxSize,
      )
    }

    // head
    canvas.fillRect(headX, headY, pxSize, pxSize)

    // render snake effect timer
    if (snake.effects.rockEater && snake.effects.rockEater.remaining !== undefined) {
      canvas.font = '50px Tiny5'
      canvas.fillStyle = `rgba(0, 0, 0, 0.1)`
      canvas.fillText(
        // made more sense when it shows updates left
        (snake.effects.rockEater.remaining - 1).toString(),
        headX + halfPxSize + 2,
        headY + halfPxSize
      )
    }
  }

  private renderNotifications(notifier: Notifier): void {
    const canvas = this._canvas
    const pxSize = this._pxSize
    const halfPxSize = this._halfPxSize

    // render notifications
    canvas.font = '22px Tiny5'
    canvas.shadowBlur = 8
    canvas.lineWidth = 1
    for (const notif of notifier.notifications) {
      const yOffet = notif.updates * 10
      // black shadow
      canvas.strokeText(
        notif.message,
        notif.position.x * pxSize + halfPxSize,
        notif.position.y * pxSize + halfPxSize + yOffet
      )
      // white text
      canvas.fillStyle = `rgba(255, 255, 255, 1)`
      canvas.fillText(
        notif.message,
        notif.position.x * pxSize + halfPxSize,
        notif.position.y * pxSize + halfPxSize + yOffet
      )
    }
    canvas.shadowBlur = 0
    canvas.lineWidth = 0
  }

}


type GameArgs = LayerArgs & {
  snakeBreed: BreedType
}
type GameState =
  | 'playing'
  | 'paused'
  | 'over'
  | 'won'
export type Stats = {
  moves: number
  snakeLength: number
  gold: number
}
type GameOverReason = 'won' | 'lost'