import EllipseActor from "muffin-game/actors/EllipseActor";


export default class WaterSpillActor extends EllipseActor {
    constructor(game) {
        super(game, 64, 64, 0x2187d9, null);
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.width = 0;
        this.height = 0;
    }

    tick(delta, keyboard) {
        this.width += delta;
        this.height += delta;
    }
}