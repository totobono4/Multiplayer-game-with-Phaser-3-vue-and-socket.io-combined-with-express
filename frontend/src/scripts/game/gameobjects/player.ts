import constants from "../constants"
import GameObject from "../gameobject";
import type Level from "../level";
import Observable from "../observable";

/**
 * The player is a game object
 * it is composed of a container containing the player sprite and its pseudo
 */
class Player extends GameObject{

    private position:Observable<{x:number, y:number}>;
    private uid:string;
    private isPlatformTransformist:boolean;
    private allowedToMove:boolean;
    private roomId:string;
    private spawnPoint:{x:number, y:number};
    private playerObj:any;
    
    public constructor(context:Level, pseudo:string, uid:string, roomId:string, platformTransformist:boolean|null = null, weight:number=60)
    {
        super(true);
        this.spawnPoint={x:0, y:0};
        this.roomId=roomId;
        this.uid=uid;
        this.isPlatformTransformist = platformTransformist ?? Math.random()<0.5;
        this.position = new Observable<{x:number, y:number}>({x:0, y:0});
        this.weight = weight;
        this.allowedToMove = true;
        
        let playerScale = 0.0015
        let player = context.add.sprite(0, 0, 'dude');
        player.scale=playerScale*context.getDimentions().height

        const container = context.add.container(0, 0);
        container.add(player)
        const text = context.add.text(0, 0, pseudo);
        player.setOrigin(0.5, 0.5)
        text.setOrigin(0.5, 2.5)
        text.setColor("0x000000")
        container.add(text)
        container.setSize(player.width*player.scaleX, player.height*player.scaleY)

        context.physics.world.enable(container)
        this.object = container;
        container.body.setBounce(constants.PLAYER_BOUNCE, 0)

        this.position.addChangeListener((pos)=>{
            this.object.setPosition(pos.x, pos.y);
        })

        this.playerObj = player;

        context.anims.create({
            key: 'left',
            frames: context.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        context.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
        
        context.anims.create({
            key: 'right',
            frames: context.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

    public getAnims()
    {
        return this.playerObj.anims;
    }

    public playAnimation(key:string)
    {
        this.playerObj.anims.play(key, true);
    }

    public setSpawnPoint(x:number, y:number)
    {
        this.spawnPoint = {x, y};
    }

    public respawn()
    {
        this.object.body.reset(this.spawnPoint.x, this.spawnPoint.y)
    }

    public getId(){
        return this.uid;
    }

    public getRoomId()
    {
        return this.roomId;
    }

    /**
     * Unused yet
     * return true if the player can transform into a platform
     * @returns 
     */
    public platformTransformist()
    {
        return this.isPlatformTransformist;
    }

    public isAllowedToMove()
    {
        return this.allowedToMove;
    }

    public setMobility(value:boolean)
    {
        this.allowedToMove = value;
        if(!value)
        {
            this.object.body.reset(this.object.x, this.object.y);
        }
    }

    public getUid()
    {
        return this.uid;
    }
    
    public getSpritePosition(dimentions:{width:number, height:number})
    {
        return {
            x:this.object.x/dimentions.height,
            y:this.object.y/dimentions.height
        }
    }

    public getPosition()
    {
        return this.position;
    }
    
    public destroy(): void {
        this.object.destroy();
    }
}

export default Player;