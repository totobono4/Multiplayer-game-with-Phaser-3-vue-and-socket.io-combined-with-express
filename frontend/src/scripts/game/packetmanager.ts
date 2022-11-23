import { Dictionary } from "./typing";
import Packet from "./packets/packet"
import {io, Socket} from "socket.io-client"

class PacketManager{

    private socket:Socket;
    private listeners:Dictionary<(data:string)=>void>

    public constructor(url:string)
    {
        this.socket = io(url)
    }

    public send(packet:Packet)
    {
        this.socket.send(packet.toJson());
    }

    public on(packetName:string, callback:(data:string)=>void)
    {
        this.listeners[packetName] = callback;
    }
}

export default PacketManager;