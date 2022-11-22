import Collectible from "../collectible";

class Star extends Collectible
{
    private x:number;
    private y:number;

    public constructor(pc:any, x:number, y:number)
    {
        super(pc);
        this.x = x;
        this.y = y;
    }

    public load() {
        let star = this.context.physics.add.sprite(this.x, this.y, 'star');
        star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        this.object = star;
    }

    protected collect(player: any, collectible: any): void {
        collectible.disableBody(true, true);
    }
}

export default Star;