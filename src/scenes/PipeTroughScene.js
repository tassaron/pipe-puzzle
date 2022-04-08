import * as PIXI from "pixi.js";
import Scene from "muffin-game/scenes/Scene";
import { logger } from "../logger";


const PIPE_SLIDE_DELAY = 30.0;


export default class PipeTroughScene extends Scene {
    subcontainer = new PIXI.Container();


    constructor(game) {
        super(game);
        this.subcontainer.y = game.height(100) - 73;
        this.subcontainer.x = 219;
        this.slideOldPipes = null;
        this.slideOldPipesSpeed = 1;
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

    addPipeToTrough(i) {
        const firstRun = i !== undefined;
        i = i === undefined ? 4 : i;
        const newPipeActor = () => {
            const newPipe = this.game.sprites.pipe();
            const pipeId = this.addActors([newPipe])[0];
            this.subcontainer.addChild(newPipe);
            newPipe.x = 73 * i;
            this.upcomingPipes.push(pipeId);
            logger.info(`Registered new pipe in trough: ${pipeId}`);
            if (firstRun) return;
            newPipe.alpha = 0.0;
            const fadeInNewPipe = (delta, keyboard) => {
                newPipe.alpha = Math.min(newPipe.alpha + (delta / 10), 1.0);
                if (newPipe.alpha == 1.0) this.beforeTick.remove(fadeInNewPipe);
            }
            this.beforeTick.add(fadeInNewPipe);
        }
        if (firstRun || i != 4) {
            newPipeActor();
            return;
        }

        // create the new actor after the old ones finish sliding left
        this.game.startTimer(newPipeActor, PIPE_SLIDE_DELAY, "next pipe appearance");
        
        if (this.slideOldPipes !== null) {
            this.slideOldPipesSpeed++;
            return;
        }
        const slideOldPipesTick = (delta, keyboard) => {
            const complete = [];
            for (let i = 0; i < this.upcomingPipes.length; i++) {
                complete[i] = false;
            }

            for (let j = 0; j < this.upcomingPipes.length; j++) {
                this.actors[this.upcomingPipes[j]].x = Math.max(
                    73 * j,
                    this.actors[this.upcomingPipes[j]].x - (73 / PIPE_SLIDE_DELAY) * (delta * this.slideOldPipesSpeed)
                );
                if (this.actors[this.upcomingPipes[j]].x == j * 73) {
                    complete[j] = true;
                }
            }
            if (complete.every((val) => val == true) && this.upcomingPipes.length == 5) {
                this.beforeTick.remove(this.slideOldPipes);
                this.slideOldPipes = null;
                this.slideOldPipesSpeed = 1;
            }
        }
        this.slideOldPipes = this.beforeTick.add(slideOldPipesTick);
    }
}