abstract class GameObject{
    protected weight:number|null;
    protected object:any;
    protected gravityAffected:boolean;

    protected constructor(affectedByGravity:boolean=false)
    {
        this.gravityAffected = affectedByGravity;
        this.weight = 0;
    }

    public isAffectedByGravity()
    {
        return this.gravityAffected;
    }

    public getWeight()
    {
        return this.weight;
    }

    public phaserObject():any
    {
        return this.object;
    }

    public abstract destroy():void;
}

export default GameObject;