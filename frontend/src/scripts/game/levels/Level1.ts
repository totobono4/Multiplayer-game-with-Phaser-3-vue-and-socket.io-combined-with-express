import Level from "../level";

import skySprite from "../assets/sky.png"
import platformSprite from "../assets/platform.png"
import starSprite from "../assets/star.png"
import dudeSprite from "../assets/dude.png"
import Platform from "../gameobjects/platform";

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
        this.setBackground("sky")

        this.addPlatform(new Platform(this, 0, this.dims.height-30, 5, 2));
    }
}

export default Level1;