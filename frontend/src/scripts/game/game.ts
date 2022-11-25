import Phaser from "phaser"
import EventManager from "./eventmanager";
import { EventType } from "./events/gameeventbase";
import { PlayerJoinedEvent } from "./events/playerjoinedevent";
import { PlayerLeftEvent } from "./events/playerleftevent";
import { PlayerStateRecievedEvent } from "./events/playerstaterecieved";
import type Level from "./level";
import { PacketManager } from "./packetmanager";
import { PacketChannel } from "./packets/packet";
import PlayerPositionPacket from "./packets/playerpositionpacket";
import PlayerReadyPacket from "./packets/playerreadypacket";

/**
 * Game booting class
 */
class Game{
    private config:any;
    private pmanager:PacketManager;
    private currentLevel:Level|null;

    public static readonly DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE || false;

    public constructor(width:number|string, height:number|string)
    {
        this.config = {
            type: Phaser.AUTO,
            width: width,
            height: height,
            physics:
            {
                default: 'arcade',
                arcade: {
                    debug: Game.DEBUG_MODE,
                }
            },
            scenes:[]
        };
        this.currentLevel = null;
        this.pmanager = new PacketManager(`${import.meta.env.VITE_SOCKET_HOST || window.location.hostname}:${import.meta.env.VITE_SOCKET_PORT || window.location.port}`);

        /**
         * sends a player state when needed
         */
        EventManager.getInstance().on(EventType.PLAYER_STATE_READY, data=>{
            this.pmanager.send(PacketChannel.PLAYER_STATE, new PlayerPositionPacket(data.sender, data.data))
        })

        /**
         * sets callbacks for socket packets
         */
        this.pmanager.on(PacketChannel.PLAYER_STATE, data=>{
            return new PlayerStateRecievedEvent(data.userId, data.data)
        })
        this.pmanager.on(PacketChannel.PLAYER_LEFT, data=>{
            console.log("player left", data)
            return new PlayerLeftEvent(data.userId, data.data)
        })
        this.pmanager.on(PacketChannel.PLAYER_READY_RECIEVE, data=>{
            console.log(data.userPseudo)
            console.log(localStorage.getItem("roomId"), data.roomId)
            if(data.userId == localStorage.getItem("uid"))
            {
                localStorage.setItem('roomId', data.roomId)
                if(this.currentLevel != null && !this.currentLevel.isReady())
                {
                    this.currentLevel.createPlayer(data.userPseudo, data.userId, data.roomId);
                    this.currentLevel.postCreate();
                }
            }
            else if(data.roomId == localStorage.getItem("roomId"))
            {
                console.log("other")
                return new PlayerJoinedEvent(data.userId, data);
            }
            return null;
        })
    }

    /**
     * set the parent container of this canvas
     * @param container 
     * @returns 
     */
    public attachTo(container:string)
    {
        this.config.parent=container;
        return this;
    }

    /**
     * add a level to the game, setting first to true will make it the fist level to appear
     * @param level 
     * @param first 
     * @returns 
     */
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

    /**
     * launched the game
     */
    public start()
    {
        let uid:string = localStorage.getItem("uid") || "";
        if(uid == "") throw "user not connected";
        this.pmanager.send(PacketChannel.PLAYER_READY_SEND, new PlayerReadyPacket(uid))
        const game = new Phaser.Game(this.config);
    }
}

export default Game;