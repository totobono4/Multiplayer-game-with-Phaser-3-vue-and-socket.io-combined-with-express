import Game from "../game";
import Level from "../level";
import Player from "../player";

class Level1 implements Level{

    private platformGroups:any[]

    public constructor()
    {
        this.platformGroups = []
    }

    public load(pc: any): void {        
        pc.add.image(400, 300, 'sky');

        let platforms = pc.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        this.platformGroups.push(platforms);

        let stars = pc.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        stars.children.iterate(function (child:any) {
        
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        
        });
    }

    public postLoad(game: Game): void {
        for(let p of this.platformGroups)
            game.addPlatformGroup(p);
    }
}

export default Level1;