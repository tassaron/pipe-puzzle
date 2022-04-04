import EllipseActor from "muffin-game/actors/EllipseActor";
import TriangleActor from "muffin-game/actors/TriangleActor";
import { playTick } from "muffin-game/core/game";
import { logger } from "../logger";


const fasterTick = (ticks) => {
    // call normal playTick more than once per tick
    // set this output as `game.state.functions.tick` to speed up the game
    return (game, delta, keyboard) => {
        for (let i = 0; i < ticks; i++) {
            playTick(game, delta, keyboard);
        }
    }
}


export default class FfwdButtonActor extends EllipseActor {
    ffwd = false;

    constructor(game) {
        super(game, 28, 28, 0x000000, null);
        this.buttonMode = true;
        this.accessible = true;
        this.accessibleTitle = "⏩";
        const newFfwdButtons = (colour) => {
            const actors = [];
            for (let i = 0; i < 2; i++) {
                actors.push(new TriangleActor(game, 16, 24, colour, null));
                actors[i].y = 8;
                actors[i].angle = 270;
            }
            actors[0].x = -18;
            actors[1].x = -2;
            return actors;
        }
        this.buttons = [
            newFfwdButtons(0xff0000),
            newFfwdButtons(0xffffff),
        ]
        this.toggleChildren();
        this.setGameSpeed(1);
    }
    
    toggleChildren() {
        this.removeChildren();
        for (let i = 0; i < 2; i++) {
            this.addChild(this.buttons[this.ffwd ? 0 : 1][i]);
        }
    }

    setGameSpeed(speed) {
        if (speed > 1) {
            this.game.state.functions.tick = fasterTick(speed);
        } else {
            this.game.state.functions.tick = playTick;
        }
        logger.info(`Switched game to ${speed}x speed`);
    }

    pointertap(e) {
        this.ffwd = !this.ffwd;
        this.toggleChildren();
        if (this.ffwd) {
            this.setGameSpeed(5);
        } else {
            this.setGameSpeed(1);
        }
    }

}
