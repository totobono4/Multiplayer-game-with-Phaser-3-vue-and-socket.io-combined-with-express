import GameObject from "./gameobject";

/**
 * base collectible class
 */
abstract class Collectible extends GameObject{
    protected context:any;

    public constructor(pc:any, weight:number|null=null)
    {
        super(weight!=null);
        this.context = pc;
        this.weight=weight;
    }

    /**
     * set this collectible to be collected by this player
     * @param player 
     */
    public collectibleBy(player:any)
    {
        this.context.physics.add.overlap(player, this.object, this.collect);
    }

    protected abstract collect(player:any, collectible:any):void;
}

export default Collectible;