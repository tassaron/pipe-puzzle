import * as PIXI from "pixi.js";
import Actor from "muffin-game/actors/Actor";


export default class ScoreNotifActor extends Actor {
    constructor(game, difference) {
        super(game);
        this.text = new PIXI.Text(
            `${difference > 0 ? '+' : ''}${difference}`,
            new PIXI.TextStyle({fontSize: 24, fill: difference > 0 ? 0x00ff00 : 0xff0000}));
        this.addChild(this.text);
    }

    tick(delta, keyboard) {
        this.y -= delta;
        this.alpha -= delta / 120;
    }
}
