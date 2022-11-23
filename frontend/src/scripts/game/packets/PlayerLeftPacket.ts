import Player from "../player";
import Packet from "./packet";

class PlayerLeftPacket implements Packet
{
    private player:Player;
    public constructor(player:Player)
    {
        this.player=player;
    }

    toJson(): string {
        return JSON.stringify({
            "uid":this.player.getUid(),
            "type":"PACKET_PLAYER_LEFT"
        })
    }
}

export default PlayerLeftPacket;