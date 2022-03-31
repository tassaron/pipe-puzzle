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

    waterCanFlow(waterDirection) {
        /* Return true if the water can flow through this pipe
         * 0 - left
         * 1 - right
         * 2 - down
         * 3 - up
         */
        switch(waterDirection) {
            case 0:
                switch(this.variety) {
                    case 0:
                    case 3:
                    case 4:
                    case 6:
                        return true;
                }
                break;
            case 1:
                switch(this.variety) {
                    case 1:
                    case 2:
                    case 4:
                    case 6:
                        return true;
                }
                break;
            case 2:
                switch(this.variety) {
                    case 0:
                    case 1:
                    case 5:
                    case 6:
                        return true;
                }
                break;
            case 3:
                switch(this.variety) {
                    case 2:
                    case 3:
                    case 5:
                    case 6:
                        return true;
                }
                break;
        }
        return false;
    }
}