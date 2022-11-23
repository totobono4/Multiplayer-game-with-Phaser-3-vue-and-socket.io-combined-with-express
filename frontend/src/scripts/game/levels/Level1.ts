import Star from "../collectibles/star";
import Level from "../level";

import skySprite from "../assets/sky.png"
import platformSprite from "../assets/platform.png"
import starSprite from "../assets/star.png"
import dudeSprite from "../assets/dude.png"
import bombSprite from "../assets/bomb.png"

class Level1 extends Level{

    public constructor()
    {      
        super("level 1")  
    }    

    protected loadAssets()
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

    protected beforePlayer()
    {        
        this.add.image(400, 300, 'sky');

        this.addPlatform(this.physics.add.staticSprite(400, 568, 'ground').setScale(2).refreshBody());
        this.addPlatform(this.physics.add.staticSprite(600, 400, 'ground'));
        this.addPlatform(this.physics.add.staticSprite(50, 250, 'ground'));
        this.addPlatform(this.physics.add.staticSprite(750, 220, 'ground'));
    }

    protected afterPlayer(){
        for(let i = 0; i<400; i+=30)
        {
            this.addCollectible(new Star(this, i, 0));
        }
    }
}

export default Level1;