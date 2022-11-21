class Logger
{
    constructor()
    {
        this.format="[Ti]:Tp:M"
        this.timeFormat = "HH:mm:ss"
        this.messageFormat = "M"
    }

    makeTime()
    {        
        return Date(Date.now()).format(this.timeFormat)
    }

    debug(message)
    {
        console.log(this.format.replace("Ti", this.makeTime()).replace("Tp", "DEBUG").replace("M", message))
    }

    error(message)
    {
        console.log(this.format.replace("Ti", this.makeTime()).replace("Tp", "ERROR").replace("M", message))
    }
}