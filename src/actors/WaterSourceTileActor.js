import { logger } from "../logger";
import RectangleActor from "muffin-game/actors/RectangleActor";
import EllipseActor from "muffin-game/actors/EllipseActor";


export const randomDirection = () => Math.floor(Math.random() * 4);


export const waterDirections = {
    left: 0,
    right: 1,
    down: 2,
    up: 3,
    0: "left",
    1: "right",
    2: "down",
    3: "up",
}


export default class WaterSourceTileActor extends RectangleActor {
    flowAnimation = null;
    direction = randomDirection();

    constructor(game, coords, maxY, maxX) {
        super(game, 73, 73, 0x000000, 0xffffff);

        const [y, x] = coords;
        this.gridy = y;
        this.gridx = x;
        logger.debug(`Water source placed at x${x},y${y}. MaxX is ${maxX}, maxY is ${maxY}`);
        while (
            (x == 0 && this.direction == waterDirections.left) ||
            (x == maxX && this.direction == waterDirections.right) ||
            (y == maxY && this.direction == waterDirections.down) ||
            (y == 0 && this.direction == waterDirections.up)) {
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
        this.flowAnimation = new EllipseActor(this.game, 1, 1, 0x2187d9, null);
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

    waterCanFlow() {
        return false;
    }
}


export function getDirectionCoords(direction, y, x) {
    switch (direction) {
        case 0:
            return [y, x - 1];
        case 1:
            return [y, x + 1];
        case 2:
            return [y + 1, x];
        case 3:
            return [y - 1, x];
    }
}