import { logger } from "muffin-game/core/logger";
import RectangleActor from "muffin-game/actors/RectangleActor";
import EllipseActor from "muffin-game/actors/EllipseActor";


export const randomDirection = () => Math.floor(Math.random() * 4);


export default class WaterSourceTileActor extends RectangleActor {
    flowAnimation = null;
    direction = randomDirection();
    /* 0 - left
     * 1 - right
     * 2 - down
     * 3 - up
     */

    constructor(game, coords, maxY, maxX) {
        super(game, 73, 73, 0x000000, 0xffffff);

        const [y, x] = coords;
        logger.debug(`Water source placed at x${x},y${y}. MaxX is ${maxX}, maxY is ${maxY}`);
        while (
            (x == 0 && this.direction == 0) ||
            (x == maxX && this.direction == 1) ||
            (y == maxY && this.direction == 2) ||
            (y == 0 && this.direction == 3)) {
                logger.debug("Oops! Water source tile had to change direction");
                this.direction = randomDirection();
        }

        // Overwrite the outline in the direction water will flow from
        const createFlowIndicator = () => {
            let flowIndicator;
            if (this.direction < 2) {
                // vertical
                flowIndicator = new RectangleActor(game, 4, 73, 0x000000, null);
            } else {
                // horizontal
                flowIndicator = new RectangleActor(game, 73, 4, 0x000000, null);
            }
            this.addChild(flowIndicator);
            switch(this.direction) {
                case 1:
                    flowIndicator.x = 73 - 4;
                    break
                case 2:
                    flowIndicator.y = 73 - 4;
                    break
                case 3:
                    flowIndicator.x = 0;
            }
        };
        this.flowIndicator = createFlowIndicator();
    }

    startFlowAnimation() {
        this.flowAnimation = new EllipseActor(this.game, 1, 1, 0x0000ff, null);
        this.addChild(this.flowAnimation);
        this.flowAnimation.x = 73 / 2;
        this.flowAnimation.y = 73 / 2;
        this.game.scene.beforeTick((delta, keyboard) => {
            if (!this.flowAnimation) return;
            this.flowAnimation.x -= delta / 8;
            this.flowAnimation.y -= delta / 8;
            this.flowAnimation.width += delta / 4;
            this.flowAnimation.height += delta / 4;
        });
    }

    stopFlowAnimation() {
        this.flowAnimation = null;
    }
}