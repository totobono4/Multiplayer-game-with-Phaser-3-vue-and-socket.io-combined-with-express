import Phaser from "phaser"
import EventManager from "./eventmanager";
import type Level from "./level";
import PacketManager from "./packetManager";
import PlayerPositionPacket from "./packets/PlayerPositionPacket"
import Player from "./player";

class Game{
    private config:any;
    private pmanager:PacketManager;

    public constructor(width:number|string, height:number|string)
    {
        this.config = {
            type: Phaser.AUTO,
            width: width,
            height: height,
            scenes:[]
        };
        this.pmanager = new PacketManager("10.3.2.10:3000");

        EventManager.getInstance().addListener("playerMove", (e)=>{
            this.pmanager.send(new PlayerPositionPacket(e.data.player as Player))
        })
    }

    public attachTo(container:string)
    {
        this.config.parent=container;
        return this;
    }

    public registerLevel(level:Level, first:boolean=false)
    {
        if(!this.config.scenes.includes(level))
        {
            this.config.scenes.push(level);
            if(first)
            {
                this.config.scene=level
            }
        }
        return this;
    }

    public start()
    {
        new Phaser.Game(this.config);
    }
}

export default Game;