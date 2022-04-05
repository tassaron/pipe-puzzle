import ButtonActor from "muffin-game/actors/ButtonActor";
import WiggleAction from "muffin-game/actors/actions/WiggleAction";


export default class ScoreTextActor extends ButtonActor {
    constructor(game, ...args) {
        super(game, ...args);
        this.wiggle = new WiggleAction(this, 5);
    }

    tick(delta, keyboard) {
        super.tick(delta, keyboard);
        this.wiggle.tick(delta, keyboard);
    }
}
