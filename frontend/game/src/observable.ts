class Observable{
    private value:any;
    private listeners:((v:any)=>void)[]

    public constructor(value:any)
    {
        this.value = value;
        this.listeners = []
    }

    public addChangeListener(listener:(v:any)=>void)
    {
        this.listeners.push(listener)
    }

    public get()
    {
        return this.value;
    }

    public set(value:any)
    {
        this.value = value;
        for(let listener of this.listeners)
        {
            listener(value);
        }
    }
}

export default Observable;