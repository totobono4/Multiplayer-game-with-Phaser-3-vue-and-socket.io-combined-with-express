import Phaser from "phaser"
import constants from "./constants"
import Game from "./game"

import Level1 from "./levels/Level1"

import bomb from "./assets/bomb.png"
import dude from "./assets/dude.png"
import platform from "./assets/platform.png"
import sky from "./assets/sky.png"
import star from "./assets/star.png"
import Player from "./player"

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

function preload ()
{
    this.load.image('sky', sky);
    this.load.image('ground', platform);
    this.load.image('star', star);
    this.load.image('bomb', bomb);
    this.load.spritesheet('dude', 
        dude,
        { frameWidth: 32, frameHeight: 48 }
    );
}

let game:Game;

function create ()
{
    let level = new Level1()
    level.load(this);
    game = new Game(this);
    level.postLoad(game);
}

function update()
{
    let player = game.getPlayer().phaserObject();
    let cursors = this.input.keyboard.addKeys(
        {jump:Phaser.Input.Keyboard.KeyCodes.SPACE,
        left:Phaser.Input.Keyboard.KeyCodes.Q,
        right:Phaser.Input.Keyboard.KeyCodes.D});
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.jump.isDown && player.body.touching.down)
    {
        player.setVelocityY(-constants.PLAYER_JUMP_FORCE);
    }
}

/*const connection = new WebSocket("ws://127.0.0.1", "protocol");
connection.onopen = (event) => {*/
new Phaser.Game(config);
/*};*/