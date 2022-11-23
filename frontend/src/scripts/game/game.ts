import Phaser from "phaser"
import EventManager from "./eventmanager";
import type Level from "./level";
import { PacketManager } from "./packetManager";
import PlayerPositionPacket from "./packets/PlayerPositionPacket";

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
        EventManager.getInstance().on("playerMove", (data)=>{
            this.pmanager.send("message", new PlayerPositionPacket(data.sender, data.data))
        })
        this.pmanager.on("reponse", (data)=>{
            return {
                data:data.data,
                name:data.type,
                sender:data.uid
            }
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