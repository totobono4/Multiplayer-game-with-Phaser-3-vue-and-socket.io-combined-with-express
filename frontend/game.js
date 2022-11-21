let context = new Context(preload, create, update)
const registry = boot(context)

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create ()
{
    this.add.image(400, 300, 'sky');
    registry.createAll(this)
}

function update()
{
    registry.updateAll()
}

//const connection = new WebSocket("ws://127.0.0.1", "protocol");
//connection.onopen = (event) => {
    context.init(null)
//};