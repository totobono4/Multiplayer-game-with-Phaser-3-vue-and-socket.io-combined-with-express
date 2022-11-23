import GameEventBase from "./events/gameeventbase";
import { Dictionary } from "./typing";

class EventManager{
    private static instance:EventManager|null = null;

    private listeners:Dictionary<((e:GameEventBase)=>void)[]>

    private constructor()
    {
        this.listeners = {}
    }

    public static getInstance()
    {
        if(this.instance == null)
        {
            this.instance = new EventManager();
        }
        return this.instance;
    }

    public emit(e:GameEventBase)
    {
        let promises:Promise<unknown>[]=[]
        console.log("emited event ", e.name)
        for(let l of this.listeners[e.name])
        {
            promises.push(new Promise((resolve, reject)=>{
                try
                {
                    l(e);
                    resolve(null);
                }
                catch(e)
                {
                    reject(e);
                }
            }));
        }
        return Promise.all(promises)
    }

    public addListener(name:string, cb:(e:GameEventBase)=>void)
    {
        if(name in this.listeners)
            this.listeners[name].push(cb);
        else
            this.listeners[name] = [cb]
    }
}

export default EventManager;