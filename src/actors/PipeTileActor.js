import TileActor from "muffin-game/actors/TileActor";
import PipeGridScene from "../scenes/PipeGridScene";


export default class PipeTileActor extends TileActor {
    gridx = -1;
    gridy = -1;
    explosion = null;
    variety = Math.floor(Math.random() * 7);
    id = "";
    trough = null;
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
        // Grid coords of texture on the spritesheet
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

    explode(id, trough) {
        this.id = id;
        this.trough = trough;
        this.container = trough.mounted;
        if (!this.id) {
            logger.error("PipeTileActor doesn't have an actor id")
        }
        if (!this.container) {
            logger.error("PipeTileActor isn't on a mounted container")
        }
        this.parent.removeChild(this);
        this.explosion = this.game.sprites.explosion();
        this.container.addChild(this.explosion);
        this.explosion.x = (this.gridy + 1) * PipeGridScene.gridSize + (PipeGridScene.gridSize / 2) - 32;
        this.explosion.y = (this.gridx + 1) * PipeGridScene.gridSize;
        this.explosion.scale.x = 2.0;
        this.explosion.scale.y = 2.0;
    }

    tick(delta, keyboard) {
        super.tick(delta, keyboard);
        this.explosion?.tick(delta, keyboard);
        if (this.explosion?.loops > 0) {
            this.explosion.destroy();
            delete this.trough.actors[this.id];
        }

    }
}
