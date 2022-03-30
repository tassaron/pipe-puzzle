import TileActor from "muffin-game/actors/TileActor";


export default class PipeTileActor extends TileActor {
    variety = Math.floor(Math.random() * 7);
    /*
    * 0 = elbow bend up/right
    * 1 = elbow bend up/left
    * 2 = elbow bend down/left
    * 3 = elbow bend down/right
    * 4 = straight left/right
    * 5 = straight up/down
    * 6 = intersection
    */

    constructor(game, texture) {
        super(game, texture, 4, 2, 73);
        const tile = {
            0: {y: 0, x: 0},
            1: {y: 0, x: 1},
            2: {y: 1, x: 0},
            3: {y: 1, x: 1},
            4: {y: 0, x: 2},
            5: {y: 1, x: 2},
            6: {y: 0, x: 3},
        }
        this.setFrame[tile[this.variety].y][tile[this.variety].x]();
    }
}