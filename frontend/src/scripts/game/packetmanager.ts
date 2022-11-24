import type {Packet, PacketChannel} from "./packets/packet"
import {io, Socket} from "socket.io-client"
import type { GameEventBase } from "./events/gameeventbase";
import EventManager from "./eventmanager";

class PacketManager{

    private socket:Socket;

    public constructor(url:string)
    {
        this.socket = io(url)
    }

    public send(channel:PacketChannel, packet:Packet)
    {
        this.socket.emit(channel, packet.export());
    }

    public on(channel:string, callback:(data:any)=>GameEventBase|null)
    {
        this.socket.on(channel, (data)=>{
            let e = callback(data)
            if(e)
                EventManager.getInstance().emit(e)
        })
    }
}

export {PacketManager};