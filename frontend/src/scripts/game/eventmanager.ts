import { EventType, GameEventBase } from "./events/gameeventbase";

class EventManager{
    private listeners:{[key: string]:((e:GameEventBase)=>void)[]}
    private static instance:EventManager|null = null;

    private constructor()
    {
        this.listeners = {}
    }

    public static getInstance()
    {
        if(this.instance == null)
        {
            this.instance = new EventManager()
        }
        return this.instance;
    }

    public on(name:EventType, cb:(e:GameEventBase)=>void)
    {
        if(name in this.listeners)
        {
            this.listeners[name].push(cb)
        }
        else
        {
            this.listeners[name] = [cb]
        }
    }

    public emit(e:GameEventBase)
    {
        if(!(e.name in this.listeners)) return;
        let promises:Promise<unknown>[] = []
        for(let l of this.listeners[e.name])
        {
            promises.push(new Promise((a, r)=>{
                try{
                    l(e);
                    a(null);
                }catch(e)
                {
                    r(e);
                }
            }))
        }
        Promise.all(promises);
    }
}

export default EventManager;