import * as PIXI from "pixi.js";
import { logger } from "../logger";
import RectangleActor from "muffin-game/actors/RectangleActor";
import TriangleActor from "muffin-game/actors/TriangleActor";


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
        super(game, 73, 73, 0x333333, 0xffffff);

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
                flowIndicator = new RectangleActor(game, 4, 73, 0xafc3de, null);
            } else {
                // horizontal
                flowIndicator = new RectangleActor(game, 73, 4, 0xafc3de, null);
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

        // Then add little arrow for extra emphasis
        const arrow = new TriangleActor(this.game, 16, 16, 0x2187d9, null);
        arrow.pivot.x = 8;
        arrow.pivot.y = 8;
        this.children[0].addChild(arrow);
        if (this.direction == 0) {
            // left
            arrow.angle = 90;
        } else if (this.direction == 1) {
            // right
            arrow.angle = 270;
        } else if (this.direction == 3) {
            // up
            arrow.angle = 180;
        }
        if (this.direction < 2) {
            arrow.y = this.children[0].height / 2;
            arrow.x = this.direction == 0 ? 8 : -8;
        } else {
            arrow.y = this.direction == 3 ? 8 : -8;
            arrow.x = this.children[0].width / 2;
        }
    }

    startFlowAnimation(delay) {
        this.flowAnimation = new RectangleActor(this.game, 72, 72, 0x2187d9, null);
        this.flowAnimation.width = 0;
        this.flowAnimation.height = 0;
        this.addChild(this.flowAnimation);
        this.flowAnimation.x = 73 / 2;
        this.flowAnimation.y = 73 / 2;
        this.game.scene.beforeTick.add((delta, keyboard) => {
            if (!this.flowAnimation) return;
            this.flowAnimation.x -= delta / 8;
            this.flowAnimation.y -= delta / 8;
            this.flowAnimation.width += delta / 4;
            this.flowAnimation.height += delta / 4;
        });
    }

    startTimer(delay) {
        // Add text to display seconds remaining
        const newTimeText = (niceTime) => {
            const text = new PIXI.Text(`${niceTime}`, new PIXI.TextStyle({fill: 0xffffff, fontSize: 24}));
            text.anchor.x = 0.5;
            text.anchor.y = 0.5;
            text.x = 73 / 2;
            text.y = 73 / 2;
            return text;
        }
        
        let currTime;
        let niceTime = Math.ceil(delay / 60);
        logger.info(`Starting waterSource's textual timer at ${niceTime}`);
        let text = newTimeText(niceTime);
        this.addChild(text);

        const tickDownTimer = (delta, keyboard) => {
            delay -= delta;
            currTime = Math.ceil(delay / 60);
            if (currTime == niceTime) return;
            niceTime = currTime;
            this.removeChild(text);
            if (niceTime < 0) {
                this.game.scene.beforeTick.remove(tickDownTimer);
                return;
            }
            text = newTimeText(niceTime);
            this.addChild(text);
        }
        this.game.scene.beforeTick.add(tickDownTimer);
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
