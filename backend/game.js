require('@geckos.io/phaser-on-nodejs')
const Phaser = require('phaser')

// set the fps you need
const FPS = 30
global.phaserOnNodeFPS = FPS // default is 60

// your MainScene
class MainScene extends Phaser.Scene {
  constructor () {
    super('MainScene')
  }

  create () {
    console.log('it works!')
  }
}

// prepare the config for Phaser
const config = {
  type: Phaser.HEADLESS,
  width: 1280,
  height: 720,
  banner: false,
  audio: false,
  scene: [MainScene],
  fps: {
    target: FPS
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 }
    }
  }
}

// start the game
const game = new Phaser.Game(config)

console.log(game)
