class GameObject{
    constructor(options={})
    {
        this.options = options
        this.object = null
    }
    create(phaser, context){
        if("create" in this.options)
        {
            this.object = this.options.create(phaser, context)
        }
        else
        {
            this.object = this.onCreate(phaser, context)
        }
    }
    onCreate(phaser, context){}

    update(context){
        if("update" in this.options)
        {
            this.options.update(this.object, context)
        }
        else
        {
            this.onUpdate(this.object, context)
        }
    }
    onUpdate(object, context){}

    destroy(){

    }
}
class GameObjectRegistry{
    constructor(context)
    {
        this.context = context
        this.objects = []
    }

    createAll(phaser)
    {
        for(let o of this.objects)
        {
            console.log(o)
            o.create(phaser, this.context)
        }
    }

    updateAll()
    {
        for(let o of this.objects)
        {
            o.update(this.context)
        }
    }

    register(name, o)
    {
        this.context.addObject(name, o)
        this.objects.push(o)
    }
}