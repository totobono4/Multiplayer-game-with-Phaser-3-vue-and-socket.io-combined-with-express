import GameObject from "../gameobject";
import type Level from "../level";

class Platform extends GameObject{
    public constructor(context:Level, x:number, y:number, width:number, height:number)
    {
        super(false);
        this.object = context.physics.add.staticSprite(x*context.getDimentions().height, y*context.getDimentions().height, 'ground');
        this.object.scaleX = width*context.getDimentions().height/this.object.height;
        this.object.scaleY = height*context.getDimentions().height/this.object.height;
        this.object.setPosition(
            this.object.x+(this.object.width*this.object.scaleX)/2,            
            this.object.y+(this.object.height*this.object.scaleY)/2
        )
        this.object.refreshBody();
    }
    
    public destroy(): void {
        this.object.destroy();
    }
}

export default Platform;