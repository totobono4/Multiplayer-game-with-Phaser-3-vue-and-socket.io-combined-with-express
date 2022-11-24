import GameObject from "../gameobject";
import type Level from "../level";
import type Player from "./player";

export class Trigger extends GameObject{

    private playerGroup:any;
    private overlap:any;

    public constructor(context:Level, x:number, y:number, width:number, height:number)
    {
        super(false);
        this.playerGroup = context.add.group();
        this.overlap = context.add.zone(x, y).setSize(width, height*context.getDimentions().height)
        
        this.object = context.physics.add.overlap(this.playerGroup, this.overlap, this.onOverlap)
    }

    private onOverlap(o1:any, o2:any)
    {

    }

    public setOverlapWithPlayer(player:Player)
    {
        this.playerGroup.add(player.phaserObject());
    }

    public destroy(): void {
        this.object.destroy();
    }
    
}