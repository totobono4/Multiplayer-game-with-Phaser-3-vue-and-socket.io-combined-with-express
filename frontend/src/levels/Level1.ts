import Collectible from "../collectible";
import Star from "../collectibles/star";
import Game from "../game";
import Level from "../level";
import Player from "../player";

class Level1 implements Level{

    private platformGroups:any[]
    private stars:Collectible[]

    public constructor()
    {
        this.platformGroups = []
        this.stars=[]
    }

    public load(pc: any): void {        
        pc.add.image(400, 300, 'sky');

        let platforms = pc.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        this.platformGroups.push(platforms);

        for(let i = 0; i<400; i+=30)
        {
            let star = new Star(pc, i, 0);
            star.load()
            this.stars.push(star);
        }
    }

    public postLoad(game: Game): void {
        for(let p of this.platformGroups)
            game.addPlatformGroup(p);
        for(let s of this.stars)
            game.addCollectible(s, true);
    }
}

export default Level1;