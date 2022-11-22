import Collectible from "../collectible";
import Star from "../collectibles/star";
import Game from "../game";
import Level from "../level";
import Player from "../player";

class Level1 implements Level{

    private platforms:any[]
    private stars:Collectible[]

    public constructor()
    {
        this.platforms = []
        this.stars=[]
    }

    public load(pc: any): void {        
        pc.add.image(400, 300, 'sky');

        this.platforms.push(pc.physics.add.staticSprite(400, 568, 'ground').setScale(2).refreshBody());
        this.platforms.push(pc.physics.add.staticSprite(600, 400, 'ground'));
        this.platforms.push(pc.physics.add.staticSprite(50, 250, 'ground'));
        this.platforms.push(pc.physics.add.staticSprite(750, 220, 'ground'));

        for(let i = 0; i<400; i+=30)
        {
            let star = new Star(pc, i, 0);
            star.load()
            this.stars.push(star);
        }
    }

    public postLoad(game: Game): void {
        for(let p of this.platforms)
            game.addPlatform(p);
        for(let s of this.stars)
            game.addCollectible(s);
        game.initGravity();
    }
}

export default Level1;