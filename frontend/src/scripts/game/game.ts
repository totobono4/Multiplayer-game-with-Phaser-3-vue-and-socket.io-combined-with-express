import Phaser from "phaser"
import type Level from "./level";

class Game{
    private config:any;

    public constructor(width:number|string, height:number|string)
    {
        this.config = {
            type: Phaser.AUTO,
            width: width,
            height: height,
            scenes:[]
        };
    }

    public attachTo(container:string)
    {
        this.config.parent=container;
        return this;
    }

    public registerLevel(level:Level, first:boolean=false)
    {
        if(!this.config.scenes.includes(level))
        {
            this.config.scenes.push(level);
            if(first)
            {
                this.config.scene=level
            }
        }
        return this;
    }

    public start()
    {
        new Phaser.Game(this.config);
    }
}

export default Game;