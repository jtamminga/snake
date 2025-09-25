import { World } from './World.js'
import { Engine } from './Engine.js'
import { Notifier } from './Notifier.js'


// canvas
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement
const canvasContext = canvas.getContext('2d')!

// notifier
const notifier = new Notifier()

// world
const world = new World({
  notifier,
  width: 8,
  height: 6,
})

// engine
const engine = new Engine({
  notifier,
  canvas: canvasContext,
  pxSize: 100,
  pxPadding: 2,
  world,
  baseUpdateInterval: 500,
  snakeSpeedMult: 10
})



engine.play()