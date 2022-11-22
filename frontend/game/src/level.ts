import GameObjetsManager from "./gameobjectsmanager";

interface Level{
    load(phazerContext:any):void;
    postLoad(game:GameObjetsManager):void
}

export default Level