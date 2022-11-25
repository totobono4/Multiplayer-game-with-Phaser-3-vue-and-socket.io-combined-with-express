import Level from "../level";

import skySprite from "../assets/sky.png"
import tutorialSprite from "../assets/tutorial-keys/Tutorial.png"
import platformSprite from "../assets/square.png"
import starSprite from "../assets/star.png";
import dudeSprite from "../assets/dude.png"
import type Player from "../gameobjects/player";
import type Collectible from "../collectible";
import Star from "../collectibles/star";

class Level1 extends Level{

    private collectibles:Collectible[]

    public constructor()
    {      
        super("level 1")  
        this.collectibles = []
    }    

    protected loadAssets()
    {
        this.load.image('sky', skySprite);
        this.load.image('star', starSprite);
        this.load.image('tutorial', tutorialSprite);
        this.load.image('ground', platformSprite);
        this.load.spritesheet('dude', 
            dudeSprite,
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    protected create()
    {        
        this.setBackground("sky")

        const tutorial = this.add.image(0.4*this.getDimentions().height, 0.4*this.getDimentions().height, 'tutorial');
        const tutorialSize = .4;
        tutorial.scaleX = tutorialSize*this.getDimentions().height/tutorial.height;
        tutorial.scaleY = tutorialSize*this.getDimentions().height/tutorial.height;
        tutorial.setPosition(
            tutorial.x+(tutorial.width*tutorial.scaleX)/2,            
            tutorial.y+(tutorial.height*tutorial.scaleY)/2
        )

        this.addPlatform(-1, this.floor-10, 1, 10);
        this.addPlatform(0, this.floor, 1, 1, {x:78, y:3});
        this.addPlatform(80, this.floor, 1, 1, {x:15, y:3});
        this.addPlatform(98, this.floor, 1, 1, {x:64, y:3});
        this.addPlatform(164,this.floor, 1, 1, {x:51, y:3});
        this.addPlatform(37, this.floor-2, 2, 2);
        this.addPlatform(47, this.floor-3, 2, 3);
        this.addPlatform(55, this.floor-4, 2, 4);
        this.addPlatform(66, this.floor-4, 2, 4);

        this.collectibles.push(new Star(this, 25, this.floor-5, 1, 1))
    }

    protected onPlayerSpawned(player: Player): void {        
        this.addTrigger(0, this.floor+2, 215, 1, player, (p)=>{
            p.respawn();
            let campos = p.phaserObject().x;
            if(campos < this.dims.width/2) campos = this.dims.width/2;
            this.cameras.main.centerOnX(campos)
        })

        this.addTrigger(200, this.floor-6, 1, 6, player, (p)=>{
            p.setMobility(false);            
        })
        for(let collectible of this.collectibles)
        {
            collectible.collectibleBy(player.phaserObject());
        }
    }

    protected getSpawnPoint(): { x: number; y: number; } {
        return {x:0.2, y:0.90}
    }
}

export default Level1;