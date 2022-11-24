import GameObject from "../gameobject";
import type Level from "../level";

class Platform extends GameObject{
    public constructor(context:Level, x:number, y:number, width:number, height:number)
    {
        super(false);
        this.object = context.physics.add.staticSprite(x, y*context.getDimentions().height, 'ground');
        this.object.scaleX = width;
        this.object.scaleY = height*context.getDimentions().height
        this.object.refreshBody();
    }
    
    public destroy(): void {
        this.object.destroy();
    }
}

export default Platform;