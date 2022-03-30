import RectangleActor from "muffin-game/actors/RectangleActor";


export default class EmptyPipeTileActor extends RectangleActor {
    constructor(game, x, y) {
        // not using x and y yet but probably will someday
        super(game, 73, 73, 0xffffff, 0x000000);
    }
}
