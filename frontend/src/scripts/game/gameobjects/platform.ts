import GameObject from "../gameobject";

class Platform extends GameObject{
    public constructor(context:any, x:number, y:number, width:number, height:number)
    {
        super(false);
        this.object = context.physics.add.staticSprite(x, y, 'ground');
        this.object.scaleX = width;
        this.object.scaleY = height;
        this.object.refreshBody();
    }
    
    public destroy(): void {
        this.object.destroy();
    }
}

export default Platform;