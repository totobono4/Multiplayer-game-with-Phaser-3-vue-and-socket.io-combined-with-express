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
        this.add.image(400, 300, 'sky');

        this.addPlatform(new Platform(this, 400, 568, 2, 1));
        this.addPlatform(new Platform(this, 600, 400, 1, 1));
        this.addPlatform(new Platform(this, 50, 250, 1, 1));
        this.addPlatform(new Platform(this, 750, 220, 1, 1));
    }
}

export default Level1;