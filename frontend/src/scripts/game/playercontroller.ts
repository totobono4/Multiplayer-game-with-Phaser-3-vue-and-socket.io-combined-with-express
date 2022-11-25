import GameConstants from "./constants";
import type Player from "./gameobjects/player";
import type Level from "./level";

export class PlayerController{

    private cursors:any;
    private context:Level;
    private player:Player|undefined;
    private jumpCounter:number;
    private lastPlatformTouchFrames:number;

    public constructor(context:Level)
    {        
        this.context = context;
        this.lastPlatformTouchFrames = 0;
        this.jumpCounter = GameConstants.MAX_JUMPING_FRAMES;
    }

    public linkTo(player:Player)
    {
        this.player=player;
    }

    public use(delta:number, size:number=0)
    {        
        this.cursors = this.context.input.keyboard.addKeys(
        {
            up:Phaser.Input.Keyboard.KeyCodes.SPACE,
            left:Phaser.Input.Keyboard.KeyCodes.Q,
            right:Phaser.Input.Keyboard.KeyCodes.D,
            run:Phaser.Input.Keyboard.KeyCodes.SHIFT
        });
        if(!this.player) return;
        const player = this.player;
        const playerObject = player.phaserObject();
        const playerVelocity = GameConstants.PLAYER_VELOCITY*(this.cursors.run.isDown ? GameConstants.PLAYER_RUN_FACTOR : 1)*this.context.getDimentions().height*delta
        const playerJump = GameConstants.PLAYER_JUMP_FORCE*this.context.getDimentions().height*delta;
        if (this.cursors.left.isDown)
        {
            playerObject.body.setVelocityX(-playerVelocity);
            player.playAnimation('left')
        }
        else if (this.cursors.right.isDown)
        {
            playerObject.body.setVelocityX(playerVelocity);
            player.playAnimation('right')
        }
        else
        {
            playerObject.body.setVelocityX(0);
            player.playAnimation('turn')
        }
        if (this.cursors.up.isDown && (this.jumpCounter > 0 || this.lastPlatformTouchFrames <= GameConstants.KOYOTE_JUMP_THRESHOLD))
        {
            playerObject.body.setVelocityY(-playerJump);
            this.jumpCounter-=delta;
        }
        if(this.cursors.up.isUp && !playerObject.body.touching.down && this.lastPlatformTouchFrames > GameConstants.KOYOTE_JUMP_THRESHOLD)
        {
            this.jumpCounter = 0;
        }

        this.lastPlatformTouchFrames += 1;        

        if(playerObject.body.touching.down)
        {
            this.lastPlatformTouchFrames = 0;
            this.jumpCounter = GameConstants.MAX_JUMPING_FRAMES;
        }
        
        if(playerObject.x > this.context.getDimentions().width/2+10 
            && (size > 0 ? playerObject.x <= size-this.context.getDimentions().width/2 : true))
        {
            this.context.cameras.main.startFollow(playerObject).setFollowOffset(0, playerObject.body.y-this.context.getDimentions().height/2+playerObject.body.height/2)
        }
        else
            this.context.cameras.main.stopFollow()

        if(size > 0 && playerObject.x > size-playerObject.body.width/2)
        {
            playerObject.setPosition(size-playerObject.body.width/2, playerObject.y)
        }
    }
}