import { Packet } from "./packet";

class PlayerReadyPacket extends Packet{
    
    public constructor(uid:string)
    {
        super(uid);
    }

    public toJson(): any {
        return "ready"
    }
}

export default PlayerReadyPacket;