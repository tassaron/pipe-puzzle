import CollisionAction from "muffin-game/actors/actions/CollisionAction";
import PipeTileActor from "../actors/PipeTileActor";


export default class MenuDecorationActor extends PipeTileActor {
    dx = 0.0;
    dy = 0.0;

    constructor(...args) {
        super(...args);
        this.collision = new CollisionAction(this);
    }

    tick(delta, keyboard) {
        super.tick(delta, keyboard);
        if (this.x < 0.0) {
            this.dx = Math.abs(this.dx);
        } else if (this.x + this.width > this.game.width) {
            this.dx = Math.abs(this.dx) * -1;
        }
        this.x += this.dx * delta;

        if (this.y < 0.0) {
            this.dy = Math.abs(this.dy);
        } else if (this.y + this.height > this.game.height) {
            this.dy = Math.abs(this.dy) * -1;
        }
        this.y += this.dy * delta;
    }
}
