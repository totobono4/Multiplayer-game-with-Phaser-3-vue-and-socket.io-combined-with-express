enum EventType{
    PLAYER_STATE_RECIEVED,
    PLAYER_STATE_READY,
    PLAYER_JOINED,
    PLAYER_LEFT
}

/**
 * base class for event handleing
 */
abstract class GameEventBase{

    protected constructor(name:EventType, sender:string, data:any)
    {
        this.name=name;
        this.sender = sender;
        this.data=data;
    }

    public name:EventType;
    public sender:string;
    public data:any;
}

export { GameEventBase, EventType }