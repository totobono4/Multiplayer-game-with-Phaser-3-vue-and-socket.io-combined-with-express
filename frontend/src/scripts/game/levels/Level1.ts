import Level from "../level";

import skySprite from "../assets/sky.png"
import tutorialSprite from "../assets/tutorial-keys/Tutorial.png"
import platformSprite from "../assets/square.png"
import dudeSprite from "../assets/dude.png"
import Platform from "../gameobjects/platform";
import type Player from "../gameobjects/player";

class Level1 extends Level{

    public constructor()
    {      
        super("level 1")  
    }    

    protected loadAssets()
    {
        this.load.image('sky', skySprite);
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

        const blockSize = 0.05

        this.addPlatform(0, 0.95, blockSize, blockSize, {x:57, y:1});
        this.addPlatform(-blockSize, 0.95-blockSize*10, blockSize, blockSize*10);
        this.addPlatform(blockSize*37, 0.95-blockSize*2, blockSize*2, blockSize*2);
        this.addPlatform(blockSize*47, 0.95-blockSize*3, blockSize*2, blockSize*3);
        this.addPlatform(blockSize*55, 0.95-blockSize*4, blockSize*2, blockSize*4);

    }

    protected onPlayerSpawned(player: Player): void {        
        this.addTrigger(0, 1.1, 1000000, 0.1, ()=>{
            player.respawn();
            let campos = player.phaserObject().x;
            if(campos < this.dims.width/2) campos = this.dims.width/2;
            this.cameras.main.centerOnX(campos)
        })
    }

    protected getSpawnPoint(): { x: number; y: number; } {
        return {x:0.2, y:0.90}
    }
}

export default Level1;