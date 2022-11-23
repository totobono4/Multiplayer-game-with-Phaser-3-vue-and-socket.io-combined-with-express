import Player from "../player";
import {Packet, PacketType} from "./packet";

class PlayerJumpPacket extends Packet
{
    private player:Player;
    public constructor(player:Player)
    {
        super()
        this.player=player;
    }

    toJson(): string {
        return JSON.stringify({
            "uid":this.player.getUid(),
            "type":PacketType.PLAYER_JUMP
        })
    }
}

export default PlayerJumpPacket;