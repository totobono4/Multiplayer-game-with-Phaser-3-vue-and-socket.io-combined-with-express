import { EventType, GameEventBase } from "./gameeventbase";

export class PlayerStateRecievedEvent extends GameEventBase
{
    public constructor(uid:string, data:any)
    {
        super(EventType.PLAYER_STATE_RECIEVED, uid, data);
    }
}