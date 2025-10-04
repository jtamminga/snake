import { Engine } from './Engine.js'


// canvas
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement
const canvasContext = canvas.getContext('2d')!

// stats elements
const lengthStatEl = document.getElementById('length-stat')!
const movesStatEl = document.getElementById('moves-stat')!
const goldStatEl = document.getElementById('gold-stat')!

// engine
const engine = new Engine({
  canvas: canvasContext,
  pxSize: 100,
  pxPadding: 3,
  worldWidth: 8,
  worldHeight: 6,
  baseUpdateInterval: 500,
  snakeSpeedMult: 10,
  afterUpdate: context => {
    lengthStatEl.innerHTML = context.snakeLength.toString()
    movesStatEl.innerHTML = context.moves.toString()
    goldStatEl.innerHTML = context.gold.toString()
  }
})