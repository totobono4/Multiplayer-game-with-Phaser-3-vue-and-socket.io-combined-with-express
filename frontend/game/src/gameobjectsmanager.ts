import Collectible from "./collectible";
import GameConstants from "./constants";
import GameObject from "./gameobject";
import Observable from "./observable";
import Player from "./player"

class GameObjetsManager
{
    private player:Player;
    private otherPlayer:Player;
    private platformGroups:any[];
    private phaserContext:any;
    private affectedByGravity:GameObject[];

    public constructor(phaserContext:any)
    {
        this.phaserContext = phaserContext;
        this.platformGroups = [];
        this.player = new Player(phaserContext, localStorage.getItem("uuid"));
        this.affectedByGravity = [this.player];
        this.setPlatformColliders(this.player);
    }

    private setPlatformColliders(o:GameObject, collider:any=null)
    {        
        if(collider)
        {
            this.phaserContext.physics.add.collider(o.phaserObject(), collider);
        }
        else
        {
            for(let group of this.platformGroups)
            {
                this.phaserContext.physics.add.collider(o.phaserObject(), group);
            }
        }
    }

    public getContext()
    {
        return this.phaserContext;
    }

    public addCollectible(collectible:Collectible)
    {
        collectible.collectibleBy(this.player.phaserObject());
        if(collectible.isAffectedByGravity())
        {
            this.affectedByGravity.push(collectible);
            this.setPlatformColliders(collectible);
        }
    }

    public addPlatform(group:any)
    {
        this.platformGroups.push(group);
        for(let o of this.affectedByGravity)
        {
            this.setPlatformColliders(o, group);
        }
    }

    public setOtherPlayer(player:Player)
    {
        this.otherPlayer = player;
        this.affectedByGravity.push(player);
        this.setPlatformColliders(this.player);
    }

    public getPlayer():Player{
        return this.player;
    }

    public getOtherPlayer():Player{
        return this.otherPlayer;
    }

    public initGravity(gravity:number=GameConstants.BASE_GRAVITY)
    {
        for(let o of this.affectedByGravity)
        {
            o.phaserObject().body.setGravityY(gravity*o.getWeight());
        }
    }
}

export default GameObjetsManager;