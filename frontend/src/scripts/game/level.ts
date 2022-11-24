import GameConstants from "./constants";
import type GameObject from "./gameobject";
import Player from "./gameobjects/player";
import Phaser from "phaser"
import EventManager from "./eventmanager";
import { EventType } from "./events/gameeventbase";
import type Platform from "./gameobjects/platform";

abstract class Level extends Phaser.Scene{
    
    protected platforms:Platform[]
    protected player:Player|undefined;
    private otherPlayers:{[key:string]:Player};
    private objects:GameObject[];
    private lastUpdateDate:number;
    protected dims:{width:number, height:number};

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
        this.dims = {width:0, height:0};
        this.platforms = []
        this.objects = []
        this.otherPlayers = {}
        this.lastUpdateDate = Date.now();
    }

    private setPlatformColliders(o:GameObject, collider:any=null)
    {        
        if(collider)
        {
            this.physics.add.collider(o.phaserObject(), collider);
        }
        else
        {
            for(let platform of this.platforms)
            {
                this.physics.add.collider(o.phaserObject(), platform.phaserObject());
            }
        }
    }
    
    protected addPlatform(platform:Platform)
    {
        this.platforms.push(platform);
        for(let o of this.objects)
        {
            if(o.isAffectedByGravity())
                this.setPlatformColliders(o, platform);
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
        if(!this.player) return;
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

        EventManager.getInstance().emit({
            data:{
                pos:this.player.getSpritePosition(this.dims),
                animationstate:this.player.phaserObject().anims.currentAnim.key,
                velocity:this.player.phaserObject().body.velocity,
                roomId:this.player.getRoomId()
            },
            sender:this.player.getUid(),
            name:EventType.PLAYER_STATE_READY
        })
        this.onUpdate(Date.now()-this.lastUpdateDate);
        this.lastUpdateDate = Date.now();
    }

    private registerEvents()
    {
        EventManager.getInstance().on(EventType.PLAYER_STATE_RECIEVED, e=>{
            if(!(e.sender in this.otherPlayers))
                return;
            this.otherPlayers[e.sender].getPosition().set({
                x:e.data.pos.x*this.dims.width,
                y:e.data.pos.y*this.dims.height
            })
            if(this.otherPlayers[e.sender].phaserObject().anims.currentAnim?.key !== e.data.animationstate)
                this.otherPlayers[e.sender].phaserObject().anims.play(e.data.animationstate)
            this.otherPlayers[e.sender].phaserObject().body.setVelocityX(e.data.velocity.x)
            this.otherPlayers[e.sender].phaserObject().body.setVelocityY(e.data.velocity.y)
        })
        EventManager.getInstance().on(EventType.PLAYER_JOINED, data=>{
            if(data.sender in this.otherPlayers || data.sender == this.player?.getUid()) return;
            this.otherPlayers[data.sender] = new Player(this, data.sender, data.data.roomId, data.data.transformist, 0);
            this.objects.push(this.otherPlayers[data.sender]);
            this.setPlatformColliders(this.otherPlayers[data.sender]);
        })
        EventManager.getInstance().on(EventType.PLAYER_LEFT, data=>{
            if(!(data.sender in this.otherPlayers) || data.sender == this.player?.getUid()) return;
            this.otherPlayers[data.sender].destroy();
            delete this.otherPlayers[data.sender];           
        })
    }

    public postCreate():void{    
        this.registerEvents();
        this.initGravity();
    }

    public isReady():boolean
    {
        return this.player != undefined;
    }

    public createPlayer(uid:string, roomId:string)
    {
        this.player = new Player(this, uid, roomId);
        this.objects.push(this.player);
        this.setPlatformColliders(this.player);
        let spawnPoint = this.getSpawnPoint();
        this.player.setSpawnPoint(spawnPoint.x, spawnPoint.y/100*this.dims.height);
        this.player.respawn();
    }

    public preload()
    {
        this.dims = this.sys.canvas;
        this.load.baseURL = `http://${window.location.host}`
        this.loadAssets();
    }

    protected setBackground(key:string)
    {
        let bg = this.add.image(0, 0, key);
        let scaleX = this.dims.width / bg.width
        let scaleY = this.dims.height / bg.height
        bg.scaleX = scaleX*2;
        bg.scaleY = scaleY*2;
    }

    public getDimentions()
    {
        return this.dims;
    }

    protected abstract getSpawnPoint():{x:number, y:number};
    protected onUpdate(timeElapsed:number){}
    protected abstract loadAssets():void;
    protected abstract create():void;
}

export default Level;