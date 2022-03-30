import * as PIXI from "pixi.js";
import RectangleActor from "muffin-game/actors/RectangleActor";
import GridScene from "muffin-game/grids/GridScene";
import { logger } from "muffin-game/core/logger";


logger.LOGLEVEL = 2;


class EmptyPipeTileActor extends RectangleActor {
    constructor(game, x, y) {
        super(game, 73, 73, 0xffffff, 0x000000);
    }
}


export default class PipeGridScene extends GridScene {
    subcontainer = new PIXI.Container();

    constructor(game) {
        const cols = 9;
        const rows = 6;
        const gridSize = 73;
        let x = -1;
        let y = 0;
        const pipeCellFactory = () => {
            x++;
            if (x > cols - 1) {
                x = 0
                y++;
            }
            if (y > rows - 1) {
                logger.error("indexerror");
                y = 0;
            }
            return new EmptyPipeTileActor(game, x, y);
        }
        super(game, rows, cols, gridSize, {initial: pipeCellFactory});
        this.actors.background = new RectangleActor(game, (73 * 9) + 4, (73 * 6) + 4, 0xffffff, 0x000000);
        this.actors.background.x = 35;
        this.actors.background.y = 28;
        this.subcontainer.x = 37;
        this.subcontainer.y = 30;
    }
}
