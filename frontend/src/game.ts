import Player from "./player"

class Game
{
    private player:Player;
    private otherPlayer:Player;
    private platformGroups:any[];
    private phaserContext:any;

    public constructor(phaserContext:any)
    {
        this.phaserContext = phaserContext;
        this.platformGroups = [];
        this.player = new Player(phaserContext);
    }

    public addPlatformGroup(group:any)
    {
        this.platformGroups.push(group)
        this.phaserContext.physics.add.collider(this.player.phaserObject(), group);
        //this.phaserContext.physics.add.collider(this.otherPlayer.phaserObject(), group);
    }

    public setOtherPlayer(player:Player)
    {
        this.otherPlayer = player;
    }

    public setPlayer(player:Player)
    {
        this.player = player;
    }

    public getPlayer():Player{
        return this.player;
    }

    public getOtherPlayer():Player{
        return this.otherPlayer;
    }
}

export default Game;