import Level from "../level";

import skySprite from "../assets/sky.png"
import platformSprite from "../assets/platform.png"
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
        this.load.image('ground', platformSprite);
        this.load.spritesheet('dude', 
            dudeSprite,
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    protected create()
    {        
        console.log(this.dims.height);
        this.setBackground("sky")

        this.addPlatform(new Platform(this, 0, 0.98, 5, 0.003));

    }

    protected onPlayerSpawned(player: Player): void {        
        this.addTrigger(0, 0.99, 1000000, 0.01, ()=>{
            player.respawn();
            let campos = player.phaserObject().x;
            if(campos < this.dims.width/2) campos = this.dims.width/2;
            this.cameras.main.centerOnX(campos)
        })
    }

    protected getSpawnPoint(): { x: number; y: number; } {
        return {x:10, y:0.9}
    }
}

export default Level1;