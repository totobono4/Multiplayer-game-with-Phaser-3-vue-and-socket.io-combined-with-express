import Level from "../level";

import skySprite from "../assets/sky.png"
import platformSprite from "../assets/platform.png"
import starSprite from "../assets/star.png"
import dudeSprite from "../assets/dude.png"

class Level1 extends Level{

    public constructor()
    {      
        super("level 1")  
    }    

    protected loadAssets()
    {
        this.load.image('sky', skySprite);
        console.log(starSprite)
        this.load.image('ground', platformSprite);
        this.load.spritesheet('dude', 
            dudeSprite,
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    protected create()
    {        
        this.add.image(400, 300, 'sky');

        this.addPlatform(this.physics.add.staticSprite(400, 568, 'ground').setScale(2).refreshBody());
        this.addPlatform(this.physics.add.staticSprite(600, 400, 'ground'));
        this.addPlatform(this.physics.add.staticSprite(50, 250, 'ground'));
        this.addPlatform(this.physics.add.staticSprite(750, 220, 'ground'));
    }
}

export default Level1;