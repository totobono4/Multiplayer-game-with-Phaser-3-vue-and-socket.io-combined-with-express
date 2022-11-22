import Collectible from "../collectible";
import Star from "../collectibles/star";
import GameConstants from "../constants";
import GameObject from "../gameobject";
import Player from "../player";
import Phaser from "phaser"

import skySprite from "../assets/sky.png"
import platformSprite from "../assets/platform.png"
import starSprite from "../assets/star.png"
import dudeSprite from "../assets/dude.png"
import bombSprite from "../assets/bomb.png"

class Level1 extends Phaser.Scene{

    private platforms:any[]
    private player:Player;
    private otherPlayer:Player;
    private objects:GameObject[];

    public constructor()
    {
        
        super({
            key: 'main',
            active: true,
            physics:
            {
                default: 'arcade',
                arcade:
                {
                    debug: false,
                    gravity:
                    {
                        y: 800
                    }
                }
            },
        })
        this.objects = []
        this.platforms = []
    }    

    

    public addCollectible(collectible:Collectible)
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

    public addPlatform(group:any)
    {
        this.platforms.push(group);
        for(let o of this.objects)
        {
            if(o.isAffectedByGravity())
                this.setPlatformColliders(o, group);
        }
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

    public preload()
    {
        this.load.image('sky', skySprite);
        this.load.image('ground', platformSprite);
        this.load.image('star', starSprite);
        this.load.image('bomb', bombSprite);
        this.load.spritesheet('dude', 
            dudeSprite,
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    public create(): void {        
        this.add.image(400, 300, 'sky');

        this.addPlatform(this.physics.add.staticSprite(400, 568, 'ground').setScale(2).refreshBody());
        this.addPlatform(this.physics.add.staticSprite(600, 400, 'ground'));
        this.addPlatform(this.physics.add.staticSprite(50, 250, 'ground'));
        this.addPlatform(this.physics.add.staticSprite(750, 220, 'ground'));
        
        this.player = new Player(this, localStorage.getItem("uuid"));
        this.objects.push(this.player);
        this.setPlatformColliders(this.player);
        this.otherPlayer = new Player(this, "111111");
        this.objects.push(this.otherPlayer);

        for(let i = 0; i<400; i+=30)
        {
            this.addCollectible(new Star(this, i, 0));
        }

        this.initGravity();
    }    
    
    public initGravity(gravity:number=GameConstants.BASE_GRAVITY)
    {
        for(let o of this.objects)
        {
            if(o.isAffectedByGravity())
                o.phaserObject().body.setGravityY(gravity*o.getWeight());
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
    }
}

export default Level1;