import Collectible from "../collectible";

class Star extends Collectible
{

    public constructor(pc:any, x:number, y:number, width:number, height:number)
    {
        super(pc);        
        this.object = this.context.physics.add.sprite(x*this.context.getDimentions().height, y*this.context.getDimentions().height, 'star');
        this.object.scaleX = width*pc.getDimentions().height/this.object.height;
        this.object.scaleY = height*pc.getDimentions().height/this.object.height;
        this.object.setPosition(
            this.object.x+(this.object.height*this.object.scaleX)/2,            
            this.object.y+(this.object.height*this.object.scaleY)/2
        )
    }

    protected collect(player: any, collectible: any): void {
        console.log("collided")
        collectible.disableBody(true, true);
    }

    public destroy(): void {
        this.object.destroy();
    }
}

export default Star;