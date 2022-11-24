import Phaser from "phaser"
import EventManager from "./eventmanager";
import { EventType } from "./events/gameeventbase";
import { PlayerJoinedEvent } from "./events/playerjoinedevent";
import { PlayerStateRecievedEvent } from "./events/playerstaterecieved";
import type Level from "./level";
import { PacketManager } from "./packetmanager";
import { PacketChannel } from "./packets/packet";
import PlayerPositionPacket from "./packets/playerpositionpackets";
import PlayerReadyPacket from "./packets/playerreadypacket";

class Game{
    private config:any;
    private pmanager:PacketManager;
    private currentLevel:Level|null;

    public constructor(width:number|string, height:number|string)
    {
        this.config = {
            type: Phaser.AUTO,
            width: width,
            height: height,
            scenes:[]
        };
        this.currentLevel = null;
        this.pmanager = new PacketManager(`${import.meta.env.VITE_SOCKET_HOST || window.location.host}:${import.meta.env.VITE_SOCKET_PORT}`);

        EventManager.getInstance().on(EventType.PLAYER_STATE_READY, (data)=>{
            this.pmanager.send(PacketChannel.PLAYER_STATE, new PlayerPositionPacket(data.sender, data.data))
        })

        this.pmanager.on(PacketChannel.PLAYER_STATE, (data)=>{
            return new PlayerStateRecievedEvent(data.uid, data.data)
        })
        this.pmanager.on(PacketChannel.PLAYER_READY_RECIEVE, (data)=>{
            if(data.uid == localStorage.getItem("uid") && this.currentLevel != null && !this.currentLevel.isReady())
            {
                this.currentLevel.createPlayer(data.uid);
                this.currentLevel.postCreate();
            }
            return new PlayerJoinedEvent(data.uid, data);
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
                this.currentLevel = level;
            }
        }
        return this;
    }

    public start()
    {
        let uid:string = localStorage.getItem("uid") || "";
        if(uid == "") throw "user not connected";
        this.pmanager.send(PacketChannel.PLAYER_READY_SEND, new PlayerReadyPacket(uid))
        new Phaser.Game(this.config);
    }
}

export default Game;