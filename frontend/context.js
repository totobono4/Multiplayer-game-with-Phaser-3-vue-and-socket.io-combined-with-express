class Context{
    constructor(preload, create, update=()=>{})
    {
        this.config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };
        this.game = null;
        this.objects={}
    }

    init(conn)
    {     
        this.connector = conn
        this.game = new Phaser.Game(this.config);   
        console.log(this.game)
    }

    addObject(name, o)
    {
        this.objects[name]=o
    }

    getObject(name)
    {
        return this.objects[name]
    }
}