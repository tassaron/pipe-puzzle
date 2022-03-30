import RectangleActor from "muffin-game/actors/RectangleActor";


export default class WaterSourceTileActor extends RectangleActor {
    constructor(game) {
        super(game, 73, 73, 0x000000, 0xffffff);
    }
}