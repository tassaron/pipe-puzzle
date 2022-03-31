import RectangleActor from "muffin-game/actors/RectangleActor";


export default class EmptyPipeTileActor extends RectangleActor {
    constructor(game, x, y) {
        super(game, 73, 73, 0xffffff, 0x000000);
        this.gridx = x;
        this.gridy = y;
    }
}
