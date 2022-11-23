enum PacketType{
    PLAYER_JUMP="PACKET_PLAYER_JUMP",
    PLAYER_LEFT="PACKET_PLAYER_LEFT",
    PLAYER_POS="PACKET_PLAYER_POS"
}

abstract class Packet{
    public abstract toJson():string;
}

export {Packet, PacketType};