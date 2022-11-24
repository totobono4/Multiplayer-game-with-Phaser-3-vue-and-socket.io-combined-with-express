import {Packet} from "./packet";

class PlayerPositionPacket extends Packet
{
    private position:{x:number, y:number}

    public constructor(uid:string, position:{x:number, y:number})
    {
        super(uid);
        this.position = position;
    }

    toJson(): any {
        return this.position
    }
}

export default PlayerPositionPacket;