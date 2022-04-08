import EllipseCollisionAction from "muffin-game/actors/actions/EllipseCollisionAction";
import PipeTileActor from "../actors/PipeTileActor";


export default class MenuDecorationActor extends PipeTileActor {
    dx = 0.0;
    dy = 0.0;

    constructor(...args) {
        super(...args);
        this.collision = new EllipseCollisionAction(this);
    }

    tick(delta, keyboard) {
        super.tick(delta, keyboard);
        if ((this.x - 36) < 0.0) {
            this.dx = Math.abs(this.dx);
        } else if ((this.x - 36) + this.width > this.game.width(100)) {
            this.dx = Math.abs(this.dx) * -1;
        }
        this.x += this.dx * delta;

        if ((this.y - 36) < 0.0) {
            this.dy = Math.abs(this.dy);
        } else if ((this.y - 36) + this.height > this.game.height(100)) {
            this.dy = Math.abs(this.dy) * -1;
        }
        this.y += this.dy * delta;
        if (this.children.length > 0) {
            const boom = this.children[0];
            boom.tick(delta, keyboard);
            this.alpha -= delta / 30;
            if (boom.loops > 0) {
                // Toss it off-canvas and leave it there
                this.tick = () => {};
                this.dx = 0.0;
                this.dy = 0.0;
                this.x = -100;
                this.y = -100;
            }
        }
    }

    explode(i) {
        if (this.children.length == 0) {
            const boom = this.game.sprites.explosion();
            boom.index = i;
            boom.scale.x = 2.0;
            boom.scale.y = 2.0;
            boom.anchor.x = 0.5;
            boom.anchor.y = 0.5;
            this.addChild(boom);
        }
    }
}
