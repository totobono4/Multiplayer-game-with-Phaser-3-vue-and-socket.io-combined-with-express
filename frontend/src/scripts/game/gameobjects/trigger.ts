import Game from "../game";
import GameObject from "../gameobject";
import type Level from "../level";
import type Player from "./player";

export class Trigger extends GameObject{

    private listeners:{object:any, cb:()=>void}[]
    private context:Level;

    public constructor(context:Level, x:number, y:number, width:number, height:number)
    {
        super(false);
        this.listeners = [];
        this.object = context.add.zone(x*context.getDimentions().height, y*context.getDimentions().height, width*context.getDimentions().height, height*context.getDimentions().height)
        this.object.setPosition(
            this.object.x+(this.object.width)/2,            
            this.object.y+(this.object.height)/2
        )        
        context.physics.world.enable(this.object, 1);
        this.context=context;
    }

    private onOverlap(player:any, _:any)
    {
        let object = this.listeners.filter((o)=>{
            return o.object == player;
        })[0]
        if(object)
        {
            return object.cb();
        }
    }

    public setOverlapWithPlayer(player:Player, cb:()=>void)
    {
        this.context.physics.add.overlap(player.phaserObject(), this.object, this.onOverlap.bind(this))
        this.listeners.push({object:player.phaserObject(), cb})
        return this;
    }

    public destroy(): void {
        this.object.destroy();
    }
    
}