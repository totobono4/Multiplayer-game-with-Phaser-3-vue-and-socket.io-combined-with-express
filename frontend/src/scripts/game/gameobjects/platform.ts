import GameObject from "../gameobject";
import type Level from "../level";

class Platform extends GameObject{
    public constructor(context:Level, x:number, y:number, width:number, height:number)
    {
        super(false);
        let ny = y*context.getDimentions().height
        this.object = context.physics.add.staticSprite(x, y*context.getDimentions().height, 'ground');
        this.object.scaleX = width;
        this.object.scaleY = height*context.getDimentions().height
        this.object.refreshBody();
        console.log(this.object.y)
    }
    
    public destroy(): void {
        this.object.destroy();
    }
}

export default Platform;