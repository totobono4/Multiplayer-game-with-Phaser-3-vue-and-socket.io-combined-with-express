import GameConstants from "./constants";
import type GameObject from "./gameobject";
import Player from "./gameobjects/player";
import Phaser from "phaser"
import EventManager from "./eventmanager";
import { EventType } from "./events/gameeventbase";
import Platform from "./gameobjects/platform";
import { Trigger } from "./gameobjects/trigger";
import Game from "./game";

abstract class Level extends Phaser.Scene{
    
    protected platforms:Platform[]
    protected player:Player|undefined;
    private otherPlayers:{[key:string]:Player};
    private objects:GameObject[];
    private lastUpdateDate:number;
    protected dims:{width:number, height:number};
    private jumpCounter:number;
    private lastPlatformTouchFrames:number;
    private size:number;

    public readonly blockSize=0.05;
    public readonly floor=1/this.blockSize-1;

    protected constructor(name:string, gravity:number=GameConstants.BASE_GRAVITY)
    {
        super({
            key: name,
            active: true,
            physics:
            {
                default: 'arcade',
                arcade: {
                    debug: Game.DEBUG_MODE,
                    gravity:
                    {
                        y: gravity
                    }
                }
            },
        });
        this.size = 0;
        this.lastPlatformTouchFrames = 0;
        this.jumpCounter = GameConstants.MAX_JUMPING_FRAMES;
        this.dims = {width:0, height:0};
        this.platforms = []
        this.objects = []
        this.otherPlayers = {}
        this.lastUpdateDate = Date.now();
    }

    private computeLevelSize()
    {
        let size = 0;
        for(let p of this.platforms)
        {
            let pos = p.phaserObject().body.x+p.phaserObject().body.width/2;
            if(pos > size)
                size = pos;
        }
        return size;
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
    
    protected addPlatform(x:number, y:number, width:number, height:number, repeat:{x?:number|undefined, y?:number|undefined}|undefined = undefined)
    {
        x *= this.blockSize
        y *= this.blockSize
        width *= this.blockSize
        height *= this.blockSize
        if(repeat)
        {
            for(let xl = 0; xl<(repeat.x||1); xl++)
            {
                for(let yl = 0; yl<(repeat.y||1); yl++)
                {
                    let platform = new Platform(this, x+xl*width, y+yl*height, width, height);                    
                    this.platforms.push(platform);
                    this.objects.push(platform);
                    for(let o of this.objects)
                    {
                        if(o.isAffectedByGravity())
                            this.setPlatformColliders(o, platform);
                    }
                }
            }
        }
        else
        {
            let platform = new Platform(this, x, y, width, height);  
            this.platforms.push(platform);
            this.objects.push(platform);
            for(let o of this.objects)
            {
                if(o.isAffectedByGravity())
                    this.setPlatformColliders(o, platform);
            }
        }
    }

    protected addTrigger(x:number, y:number, width:number, height:number, player:Player, cb:(player:Player)=>void)
    {
        x *= this.blockSize
        y *= this.blockSize
        width *= this.blockSize
        height *= this.blockSize
        let trigger = new Trigger(this, x, y, width, height)
        .setOverlapWithPlayer(player, cb);
        this.objects.push(trigger);
    }


    private initGravity(gravity:number=GameConstants.BASE_GRAVITY)
    {
        for(let o of this.objects)
        {
            if(o.isAffectedByGravity())
                o.phaserObject().body.setGravityY(gravity*(o?.getWeight()??1) * this.dims.height);
        }
    }
    
    public update(time:any, delta:any)
    {
        if(!this.player) return;
        if(this.player.isAllowedToMove())
        {
            const player = this.player.phaserObject();
            const cursors = this.input.keyboard.addKeys(
            {
                up:Phaser.Input.Keyboard.KeyCodes.SPACE,
                left:Phaser.Input.Keyboard.KeyCodes.Q,
                right:Phaser.Input.Keyboard.KeyCodes.D,
                run:Phaser.Input.Keyboard.KeyCodes.SHIFT
            }) as any;
            const playerVelocity = GameConstants.PLAYER_VELOCITY*(cursors.run.isDown ? GameConstants.PLAYER_RUN_FACTOR : 1)*this.dims.height
            const playerJump = GameConstants.PLAYER_JUMP_FORCE*this.dims.height;
            if (cursors.left.isDown)
            {
                player.body.setVelocityX(-playerVelocity);
                this.player.playAnimation('left')
            }
            else if (cursors.right.isDown)
            {
                player.body.setVelocityX(playerVelocity);
                this.player.playAnimation('right')
            }
            else
            {
                player.body.setVelocityX(0);
                this.player.playAnimation('turn')
            }
            if (cursors.up.isDown && (this.jumpCounter > 0 || this.lastPlatformTouchFrames <= GameConstants.KOYOTE_JUMP_THRESHOLD))
            {
                player.body.setVelocityY(-playerJump);
                this.jumpCounter-=delta;
            }
            if(cursors.up.isUp && !player.body.touching.down && this.lastPlatformTouchFrames > GameConstants.KOYOTE_JUMP_THRESHOLD)
            {
                this.jumpCounter = 0;
            }

            this.lastPlatformTouchFrames += 1;        

            if(player.body.touching.down)
            {
                this.lastPlatformTouchFrames = 0;
                this.jumpCounter = GameConstants.MAX_JUMPING_FRAMES;
            }
            
            if(player.x > this.dims.width/2+10 && player.x <= this.size-this.dims.width/2)
            {
                this.cameras.main.startFollow(player).setFollowOffset(0, player.body.y-this.dims.height/2+player.body.height/2)
            }
            else
                this.cameras.main.stopFollow()

            if(player.x > this.size-player.body.width/2)
            {
                player.setPosition(this.size-player.body.width/2, player.y)
            }
        }
        else
        {            
            this.player.playAnimation('turn');
        }

        EventManager.getInstance().emit({
            data:{
                pos:this.player.getSpritePosition(this.dims),
                animationstate:this.player.getAnims().currentAnim.key,
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
                x:e.data.pos.x*this.dims.height,
                y:e.data.pos.y*this.dims.height
            })
            if(this.otherPlayers[e.sender].getAnims().currentAnim?.key !== e.data.animationstate)
                this.otherPlayers[e.sender].getAnims().play(e.data.animationstate)
            this.otherPlayers[e.sender].phaserObject().body.setVelocityX(e.data.velocity.x)
            this.otherPlayers[e.sender].phaserObject().body.setVelocityY(e.data.velocity.y)
        })
        EventManager.getInstance().on(EventType.PLAYER_JOINED, data=>{
            if(data.sender in this.otherPlayers || data.sender == this.player?.getUid()) return;
            this.otherPlayers[data.sender] = new Player(this, data.data.userPseudo, data.sender, data.data.roomId, data.data.transformist, 0);
            this.otherPlayers[data.sender].phaserObject().setAlpha(0.5)
            this.objects.push(this.otherPlayers[data.sender]);
            this.setPlatformColliders(this.otherPlayers[data.sender]);
            this.onPlayerSpawned(this.otherPlayers[data.sender]);
        })
        EventManager.getInstance().on(EventType.PLAYER_LEFT, data=>{
            if(!(data.sender in this.otherPlayers) || data.sender == this.player?.getUid()) return;
            this.otherPlayers[data.sender].destroy();
            this.objects = this.objects.filter((p)=>{
                if(p instanceof Player)
                    return p.getId() != data.sender
                return true
            })
            delete this.otherPlayers[data.sender];           
        })
    }

    public postCreate():void{ 
        this.size = this.computeLevelSize();   
        this.registerEvents();
        this.initGravity();
    }

    public isReady():boolean
    {
        return this.player != undefined;
    }

    public createPlayer(pseudo:string, uid:string, roomId:string)
    {
        this.player = new Player(this, pseudo, uid, roomId);
        this.objects.push(this.player);
        this.setPlatformColliders(this.player);
        let spawnPoint = this.getSpawnPoint();
        this.player.setSpawnPoint(spawnPoint.x*this.getDimentions().height, spawnPoint.y*this.getDimentions().height);
        this.player.respawn();
        this.onPlayerSpawned(this.player);
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
        bg.scaleX = this.getDimentions().width/bg.height;
        bg.scaleY = this.getDimentions().height/bg.height;
        bg.setPosition(
            bg.x+(bg.height*bg.scaleX)/2,            
            bg.y+(bg.height*bg.scaleY)/2
        )
        bg.setScrollFactor(0)
    }

    public getDimentions()
    {
        return this.dims;
    }

    protected abstract getSpawnPoint():{x:number, y:number};
    protected onUpdate(timeElapsed:number){}
    protected abstract loadAssets():void;
    protected abstract create():void;
    protected onPlayerSpawned(player:Player){}
}

export default Level;