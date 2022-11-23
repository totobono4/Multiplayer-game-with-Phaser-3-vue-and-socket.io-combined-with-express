import Collectible from "./collectible";
import GameConstants from "./constants";
import GameObject from "./gameobject";
import Player from "./player";
import Phaser from "phaser"
import EventManager from "./eventmanager";
import { PacketType } from "./packets/packet";

abstract class Level extends Phaser.Scene{
    
    protected platforms:any[]
    private player:Player;
    private otherPlayer:Player;
    private objects:GameObject[];
    private lastUpdateDate:number;
    private lastEmitionDate:number;

    protected constructor(name:string, gravity:number=GameConstants.BASE_GRAVITY)
    {
        super({
            key: name,
            active: true,
            physics:
            {
                default: 'arcade',
                arcade: {
                    debug: false,
                    gravity:
                    {
                        y: gravity
                    }
                }
            },
        });
        this.platforms = []
        this.objects = []
        this.lastUpdateDate = Date.now();
        this.lastEmitionDate = Date.now();
    }

    private setPlatformColliders(o:GameObject, collider:any=null)
    {        
        if(collider)
        {
            this.physics.add.collider(o.phaserObject(), collider);
        }
        else
        {
            for(let group of this.platforms)
            {
                this.physics.add.collider(o.phaserObject(), group);
            }
        }
    }
    
    protected addPlatform(group:any)
    {
        this.platforms.push(group);
        for(let o of this.objects)
        {
            if(o.isAffectedByGravity())
                this.setPlatformColliders(o, group);
        }
    }


    private initGravity(gravity:number=GameConstants.BASE_GRAVITY)
    {
        for(let o of this.objects)
        {
            if(o.isAffectedByGravity())
                o.phaserObject().body.setGravityY(gravity*(o?.getWeight()??1));
        }
    }
    
    public update()
    {
        let player = this.player.phaserObject();
        let cursors = this.input.keyboard.addKeys(
            {up:Phaser.Input.Keyboard.KeyCodes.SPACE,
            left:Phaser.Input.Keyboard.KeyCodes.Q,
            right:Phaser.Input.Keyboard.KeyCodes.D}) as any;
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
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-GameConstants.PLAYER_JUMP_FORCE);
        }

        if(Date.now()-this.lastEmitionDate >= 1)
        {
            console.log(this.player.phaserObject())
            EventManager.getInstance().emit({
                data:{
                    pos:this.player.getSpritePosition(),
                    animationstate:this.player.phaserObject().anims.currentAnim.key,
                    velocity:this.player.phaserObject().body.velocity
                },
                sender:this.player.getUid(),
                name:"playerMove"
            })
            this.lastEmitionDate = Date.now();
        }
        this.onUpdate(Date.now()-this.lastUpdateDate);
        this.lastUpdateDate = Date.now();
    }

    protected addCollectible(collectible:Collectible)
    {
        collectible.load();
        collectible.collectibleBy(this.player.phaserObject());
        collectible.collectibleBy(this.otherPlayer.phaserObject());
        this.objects.push(collectible);
        if(collectible.isAffectedByGravity())
        {
            this.setPlatformColliders(collectible);
        }
    }

    private registerEvents()
    {
        EventManager.getInstance().on(PacketType.PLAYER_POS, (e)=>{
            this.otherPlayer.getPosition().set({
                x:e.data.pos.x,
                y:e.data.pos.y
            })
            if(this.otherPlayer.phaserObject().anims.currentAnim?.key !== e.data.animationstate)
                this.otherPlayer.phaserObject().anims.play(e.data.animationstate)
            this.otherPlayer.phaserObject().body.setVelocityX(e.data.velocity.x)
            this.otherPlayer.phaserObject().body.setVelocityY(e.data.velocity.y)
        })
    }

    public create(): void {        
        this.beforePlayer();
        this.createPlayers();
        this.afterPlayer();
        this.registerEvents();
        this.initGravity();
    }

    protected createPlayers()
    {
        this.player = new Player(this, localStorage.getItem("uid")??"00000");
        console.log(this.player.getUid())
        this.objects.push(this.player);
        this.setPlatformColliders(this.player);
        this.otherPlayer = new Player(this, "111111", 0);
        this.objects.push(this.otherPlayer);
        this.setPlatformColliders(this.otherPlayer);
    }

    protected onUpdate(timeElapsed:number){}

    public abstract preload():void;
    protected abstract beforePlayer():void;
    protected abstract afterPlayer():void;
}

export default Level;