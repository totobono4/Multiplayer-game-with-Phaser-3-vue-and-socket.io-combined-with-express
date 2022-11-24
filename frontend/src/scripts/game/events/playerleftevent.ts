import { EventType, GameEventBase } from "./gameeventbase";

export class PlayerLeftEvent extends GameEventBase{
    public constructor(uid:string, data:any)
    {
        super(EventType.PLAYER_LEFT, uid, data)
    }
}