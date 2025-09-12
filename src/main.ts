import { World } from './World.js'
import { Snake } from './Snake.js'
import { Engine } from './Engine.js'


// canvas
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement
const canvasContext = canvas.getContext('2d')!

// hud elements
const stateEl = document.getElementById('state')!
const effectsEl = document.getElementById('effects')!

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

function updateHud() {
  stateEl.innerText = snake.alive ? 'alive' : 'dead'
  effectsEl.innerHTML = snake.effects.all.map(effect => {
    return `
      <div class="effect ${effect.constructor.name}">
        ${effect.remaining}
      </div>
    `
  }).join('')
}

// engine
const engine = new Engine({
  canvas: canvasContext,
  pxSize: 100,
  pxPadding: 2,
  world,
  baseUpdateInterval: 500,
  snakeSpeedMult: 10,
  afterUpdate: updateHud
})



engine.play()