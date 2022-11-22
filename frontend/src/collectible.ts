import Player from "./player";

abstract class Collectible{

    protected object:any;
    protected context:any;
    private weight:number;

    public constructor(pc:any, weight:number=20)
    {
        this.context = pc;
        this.weight=weight;
    }

    public getWeight()
    {
        return this.weight;
    }

    public phaserObject():any
    {
        return this.object;
    }

    public collectibleBy(player:Player)
    {
        this.context.physics.add.overlap(player, this.object, this.collect, null, this);
    }

    public abstract load():void;

    protected abstract collect(player:any, collectible:any):void;
}

export default Collectible;