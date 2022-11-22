class Observable<T>{
    private value:T;
    private listeners:((v:T)=>void)[]

    public constructor(value:T)
    {
        this.value = value;
        this.listeners = []
    }

    public addChangeListener(listener:(v:T)=>void)
    {
        this.listeners.push(listener)
    }

    public get()
    {
        return this.value;
    }

    public set(value:T)
    {
        this.value = value;
        for(let listener of this.listeners)
        {
            listener(value);
        }
    }
}

export default Observable;