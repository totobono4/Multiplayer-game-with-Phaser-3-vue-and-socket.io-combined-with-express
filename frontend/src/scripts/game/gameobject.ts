abstract class GameObject{
    protected weight:number|null;
    protected object:any;
    protected gravityAffected:boolean;

    protected constructor(affectedByGravity:boolean=false)
    {
        this.gravityAffected = affectedByGravity;
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
}

export default GameObject;