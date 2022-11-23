import Player from "../player";
import {Packet, PacketType} from "./packet";

class PlayerPositionPacket extends Packet
{
    private uid:string;
    private position:{x:number, y:number}

    public constructor(uid:string, position:{x:number, y:number})
    {
        super();
        this.uid = uid;
        this.position = position;
    }

    toJson(): string {
        return JSON.stringify({
            uid:this.uid,
            type:PacketType.PLAYER_POS,
            data:this.position
        })
    }
}

export default PlayerPositionPacket;