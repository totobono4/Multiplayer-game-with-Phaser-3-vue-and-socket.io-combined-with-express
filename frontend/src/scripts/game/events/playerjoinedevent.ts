import { EventType, GameEventBase } from "./gameeventbase";

export class PlayerJoinedEvent extends GameEventBase{
    public constructor(sender:string, data:any)
    {
        super(EventType.PLAYER_JOINED, sender, data)
    }
}