import ButtonActor from "muffin-game/actors/ButtonActor";


const WIGGLE_ANGLE = 3;


export default class ScoreTextActor extends ButtonActor {
    _wiggle = 0;
    direction = 0;

    tick(delta, keyboard) {
        super.tick(delta, keyboard);
        if (this.wiggle == 0 && this.direction == 2) return;
        console.log(this.wiggle);
        switch (this.direction) {
            case 0:
                // halfway right
                this.wiggle = Math.min(this.wiggle + delta, WIGGLE_ANGLE);
                if (this.wiggle == WIGGLE_ANGLE) this.direction++;
                break;
            case 1:
                // left
                this.wiggle = Math.max(this.wiggle - delta, WIGGLE_ANGLE * -1);
                if (this.wiggle == WIGGLE_ANGLE * -1) this.direction++;
                break;
            case 2:
                // halfway right again
                this.wiggle = Math.min(this.wiggle + delta, 0);
        }
    }

    get wiggle() {
        return this._wiggle;
    }

    set wiggle(value) {
        this._wiggle = value;
        this.angle = value < 0 ? (360 + value) : value;
    }
}