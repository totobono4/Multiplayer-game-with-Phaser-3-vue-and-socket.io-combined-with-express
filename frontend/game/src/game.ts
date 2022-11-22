import GameConstants from "./constants";
import GameObjetsManager from "./gameobjectsmanager";
import Level1 from "./levels/Level1";

import Phaser from "phaser"

import bomb from "./assets/bomb.png"
import dude from "./assets/dude.png"
import platform from "./assets/platform.png"
import sky from "./assets/sky.png"
import star from "./assets/star.png"

class Game{
    private objectManager:GameObjetsManager
    private context:any;
    private config:any;

    public constructor(width:number, height:number)
    {
        this.config = {
            type: Phaser.AUTO,
            width: width,
            height: height,
            physics: {
                default: 'arcade',
                arcade: {
                }
            },
            scene: {
                preload: this.preload,
                create: this.create,
                update: this.update
            }
        };
    }

    public start()
    {
        new Phaser.Game(this.config);
    }

    private preload()
    {
        this.context.load.image('sky', sky);
        this.context.load.image('ground', platform);
        this.context.load.image('star', star);
        this.context.load.image('bomb', bomb);
        this.context.load.spritesheet('dude', 
            dude,
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    private create()
    {
        localStorage.setItem("uuid", "00000");
        let level = new Level1()
        level.load(this);
        this.objectManager = new GameObjetsManager(this);
        level.postLoad(this.objectManager);
    }

    private update()
    {
        if(this.objectManager.getOtherPlayer())
        {
            let player = this.objectManager.getPlayer().phaserObject();
            let cursors = this.context.input.keyboard.addKeys(
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
                player.setVelocityY(-GameConstants.PLAYER_JUMP_FORCE);
            }
        }
    }
}

export default Game;