import EllipseActor from "muffin-game/actors/EllipseActor";
import TriangleActor from "muffin-game/actors/TriangleActor";
import { playTick } from "muffin-game/core/game";


const FFWD_TICKS = 5;


const fasterTick = (game, delta, keyboard) => {
    for (let i = 0; i < FFWD_TICKS; i++) {
        playTick(game, delta, keyboard);
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
        this.toggle();
        this.game.state.functions.tick = playTick;
    }

    pointertap(e) {
        this.ffwd = !this.ffwd;
        this.toggle();
        if (this.ffwd) {
            this.game.state.functions.tick = fasterTick;
        } else {
            this.game.state.functions.tick = playTick;
        }
    }

    toggle() {
        this.removeChildren();
        for (let i = 0; i < 2; i++) {
            this.addChild(this.buttons[this.ffwd ? 0 : 1][i]);
        }
    }
}
