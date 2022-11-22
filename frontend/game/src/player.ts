import constants from "./constants"
import GameObject from "./gameobject";
import Observable from "./observable";

class Player extends GameObject{

    private position:Observable<{x:number, y:number}>;
    private uuid:string;
    
    public constructor(context:any, uuid:string, weight:number=60)
    {
        super(true);
        this.uuid=uuid;
        this.position = new Observable<{x:number, y:number}>({x:0, y:0});
        this.weight = weight;
        let player = context.physics.add.sprite(100, 450, 'dude');

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

    public getUuid()
    {
        return this.uuid;
    }
    

    public getPosition()
    {
        return this.position;
    }
}

export default Player;