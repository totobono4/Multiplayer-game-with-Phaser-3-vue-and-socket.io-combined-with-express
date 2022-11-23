import Level1 from "./levels/Level1";

import Phaser from "phaser"

class Game{
    private config:any;

    public constructor(width:number, height:number)
    {
        this.config = {
            type: Phaser.AUTO,
            width: width,
            height: height,
            scene:Level1
        };
    }

    public attachTo(container:string)
    {
        this.config.parent=container;
        return this;
    }

    public start()
    {
        new Phaser.Game(this.config);
    }
}

export default Game;