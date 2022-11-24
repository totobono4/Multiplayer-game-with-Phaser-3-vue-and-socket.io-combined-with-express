import constants from "../constants"
import GameObject from "../gameobject";
import Observable from "../observable";

class Player extends GameObject{

    private position:Observable<{x:number, y:number}>;
    private uid:string;
    private isPlatformTransformist:boolean;
    private allowedToMove:boolean;
    private roomId:string;
    
    public constructor(context:any, uid:string, roomId:string, platformTransformist:boolean|null = null, weight:number=60)
    {
        super(true);
        this.roomId=roomId;
        this.uid=uid;
        this.isPlatformTransformist = platformTransformist ?? Math.random()<0.5;
        this.position = new Observable<{x:number, y:number}>({x:0, y:0});
        this.weight = weight;
        let player = context.physics.add.sprite(100, 450, 'dude');
        this.allowedToMove = true;

        player.setBounce(constants.PLAYER_BOUNCE, 0);
        player.setCollideWorldBounds(true);
        this.object = player;
        this.position.addChangeListener((pos)=>{
            this.object.setPosition(pos.x, pos.y);
        })

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

    public getRoomId()
    {
        return this.roomId;
    }

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
    }

    public getUid()
    {
        return this.uid;
    }
    
    public getSpritePosition()
    {
        return {
            x:this.object.x,
            y:this.object.y
        }
    }

    public getPosition()
    {
        return this.position;
    }
}

export default Player;