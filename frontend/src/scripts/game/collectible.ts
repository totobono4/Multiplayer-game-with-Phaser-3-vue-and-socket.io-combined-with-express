import GameObject from "./gameobject";

abstract class Collectible extends GameObject{
    protected context:any;

    public constructor(pc:any, weight:number|null=null)
    {
        super(weight!=null);
        this.context = pc;
        this.weight=weight;
    }

    public collectibleBy(player:any)
    {
        this.context.physics.add.overlap(player, this.object, this.collect, null, this);
    }

    public abstract load():void;

    protected abstract collect(player:any, collectible:any):void;
}

export default Collectible;