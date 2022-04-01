import * as PIXI from "pixi.js";
import Scene from "muffin-game/scenes/Scene";
import { logger } from "muffin-game/core/logger";


export default class PipeTroughScene extends Scene {
    subcontainer = new PIXI.Container();

    constructor(game) {
        super(game);
        this.subcontainer.y = game.height - 73;
        this.subcontainer.x = 219;
        this.upcomingPipes = [];
        for (let i = 0; i < 5; i++) {
            this.addPipeToTrough();
        }
    }

    getNextPipe() {
        const nextPipe = this.upcomingPipes.splice(0, 1);
        logger.info(`Removing ${nextPipe} from trough scene's container`)
        if (this.mounted) {
            this.mounted.removeChild(this.actors[nextPipe]);
        }
        this.addPipeToTrough();
        return this.actors[nextPipe];
    }

    addPipeToTrough() {
        const i = 4;
        const newPipe = this.game.sprites.pipe();
        const pipeId = this.addActors([newPipe])[0];
        this.subcontainer.addChild(newPipe);
        for (let j = 0; j < this.upcomingPipes.length; j++) {
            this.actors[this.upcomingPipes[j]].x = j * 73;
        }
        newPipe.x = 73 * i;
        logger.info(`Registered new pipe in trough: ${pipeId}`);
        this.upcomingPipes.push(pipeId);
    }
}