import {Packet, PacketChannel} from "./packets/packet"
import {io, Socket} from "socket.io-client"
import { GameEventBase } from "./events/gameeventbase";
import EventManager from "./eventmanager";

class PacketManager{

    private socket:Socket;
    private listeners:{[Key:string]:(data:string)=>void}

    public constructor(url:string)
    {
        this.socket = io(url)
    }

    public send(channel:PacketChannel, packet:Packet)
    {
        this.socket.emit(channel, packet.export());
    }

    public on(channel:string, callback:(data:any)=>GameEventBase)
    {
        this.socket.on(channel, (data)=>{
            EventManager.getInstance().emit(callback(data))
        })
    }
}

export {PacketManager};