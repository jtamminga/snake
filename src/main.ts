import { World } from './World.js'
import { Snake } from './Snake.js'
import { Engine } from './Engine.js'


// canvas
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement
const canvasContext = canvas.getContext('2d')!


// snake
const snake = new Snake({
  startX: 0,
  startY: 0,
  baseSpeed: 1
})

// world
const world = new World({
  width: 8,
  height: 6,
  snake
})

// engine
const engine = new Engine({
  canvas: canvasContext,
  pxSize: 100,
  pxPadding: 2,
  world,
  baseUpdateInterval: 500,
  snakeSpeedMult: 10
})



engine.play()