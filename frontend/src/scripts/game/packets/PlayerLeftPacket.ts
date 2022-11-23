import Player from "../player";
import {Packet, PacketType} from "./packet";

class PlayerLeftPacket extends Packet
{
    private player:Player;
    public constructor(player:Player)
    {
        super();
        this.player=player;
    }

    toJson(): string {
        return JSON.stringify({
            "uid":this.player.getUid(),
            "type":PacketType.PLAYER_LEFT
        })
    }
}

export default PlayerLeftPacket;