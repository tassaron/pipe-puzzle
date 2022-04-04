import RectangleActor from "muffin-game/actors/RectangleActor";
import WiggleAction from "muffin-game/actors/actions/WiggleAction";


export default class EmptyPipeTileActor extends RectangleActor {
    constructor(game, x, y) {
        super(game, 73, 73, 0xffffff, 0x333333);
        this.gridx = x;
        this.gridy = y;
        this._wiggle = new WiggleAction(game, this);
        this._wiggle.direction = 2;
    }

    tick(delta, keyboard) {
        super.tick(delta, keyboard);
        this._wiggle.tick(delta, keyboard);
    }

    wiggle() {
        this._wiggle.direction = 0;
    }
}
