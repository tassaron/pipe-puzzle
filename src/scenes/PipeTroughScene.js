import * as PIXI from "pixi.js";
import Scene from "muffin-game/scenes/Scene";
import { logger } from "../logger";


const PIPE_SLIDE_DELAY = 30.0;


export default class PipeTroughScene extends Scene {
    subcontainer = new PIXI.Container();

    constructor(game) {
        super(game);
        this.subcontainer.y = game.height - 73;
        this.subcontainer.x = 219;
        this.upcomingPipes = [];
        for (let i = 0; i < 5; i++) {
            this.addPipeToTrough(i);
        }
    }

    getNextPipe() {
        const nextPipe = this.upcomingPipes.splice(0, 1);
        logger.info(`Removing ${nextPipe} from trough scene's container`)
        if (this.mounted) {
            this.mounted.removeChild(this.actors[nextPipe]);
        }
        this.addPipeToTrough();
        return nextPipe;
    }

    addPipeToTrough(i=4) {
        const newPipeActor = () => {
            const newPipe = this.game.sprites.pipe();
            const pipeId = this.addActors([newPipe])[0];
            this.subcontainer.addChild(newPipe);
            newPipe.x = 73 * i;
            this.upcomingPipes.push(pipeId);
            logger.info(`Registered new pipe in trough: ${pipeId}`);
        }
        if (i != 4) {
            newPipeActor();
            return;
        }

        // create the new actor after the old ones finish sliding left
        this.game.startTimer(newPipeActor, PIPE_SLIDE_DELAY, "next pipe appearance");
        
        const slideOldPipesTick = (delta, keyboard) => {
            if (this.actors[this.upcomingPipes[0]].x == 0) {
                // finished sliding
                this._beforeTickFuncs = [];
            }
            for (let j = 0; j < this.upcomingPipes.length; j++) {
                this.actors[this.upcomingPipes[j]].x = Math.max(
                    73 * j,
                    this.actors[this.upcomingPipes[j]].x - (73 / PIPE_SLIDE_DELAY) * delta
                );
            }
        }
        this.beforeTick(slideOldPipesTick);
    }
}