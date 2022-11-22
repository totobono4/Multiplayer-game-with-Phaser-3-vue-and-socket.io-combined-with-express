import Game from "./game";

interface Level{
    load(phazerContext:any):void;
    postLoad(game:Game):void
}

export default Level