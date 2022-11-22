import Player from "./player";

abstract class Collectible{

    protected object:any;
    protected context:any;

    public constructor(pc:any)
    {
        this.context = pc;
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