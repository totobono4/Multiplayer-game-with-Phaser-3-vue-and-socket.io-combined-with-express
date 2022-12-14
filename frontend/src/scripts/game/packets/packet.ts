enum PacketChannel{
    PLAYER_STATE="playerState",
    PLAYER_READY_SEND="playerReady",
    PLAYER_READY_RECIEVE="playerJoined",
    PLAYER_LEFT="playerLeft"
}

abstract class Packet{
    private uid:string;

    protected constructor(uid:string)
    {
        this.uid=uid;
    }

    public export()
    {
        return {
            userId:this.uid,
            data:this.toJson()
        };
    }

    public abstract toJson():any;
}

export {Packet, PacketChannel};