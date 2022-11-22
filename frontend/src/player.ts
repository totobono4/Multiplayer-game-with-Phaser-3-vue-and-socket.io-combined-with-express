import constants from "./constants"

class Player{
    private object:any;

    public constructor(context:any)
    {
        let player = context.physics.add.sprite(100, 450, 'dude');

        player.setBounce(constants.PLAYER_BOUNCE, 0);
        player.setCollideWorldBounds(true);
        player.body.setGravityY(constants.PLAYER_GRAVITY);
        this.object = player;

        context.anims.create({
            key: 'left',
            frames: context.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        context.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
        
        context.anims.create({
            key: 'right',
            frames: context.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

    public phaserObject()
    {
        return this.object;
    }
}

export default Player;