import * as PIXI from "pixi.js";
import WorldScene from "./WorldScene";
import WaterSourceTileActor, { getDirectionCoords, waterDirections } from "../actors/WaterSourceTileActor";
import Actor from "muffin-game/actors/Actor";
import EmptyPipeTileActor from "../actors/EmptyPipeTileActor";
import RectangleActor from "muffin-game/actors/RectangleActor";
import GridScene from "muffin-game/grids/GridScene";
import { logger } from "../logger";


const FLOW_DELAY = 254.0;


export default class PipeGridScene extends GridScene {
    subcontainer = new PIXI.Container();

    constructor(game) {
        const cols = 6;
        const rows = 9;
        const gridSize = 73;
        let x = -1;
        let y = 0;

        // A closure capturing x, y to fill the grid with clickable tiles
        const pipeCellFactory = () => {
            x++;
            if (x > cols - 1) {
                x = 0
                y++;
            }
            if (y > rows - 1) {
                logger.error("IndexError while creating PipeGridScene (the closure broke)");
                y = 0;
            }
            return new EmptyPipeTileActor(game, x, y);
        }
        super(game, cols, rows, gridSize, {initial: pipeCellFactory});

        // Where the water starts
        this.waterSource = [Math.floor(Math.random() * this.cols), Math.floor(Math.random() * this.rows)];

        const random = (max) => Math.floor(Math.random() * (max + 1));
        this.waterDestination = [random(1), random(1)];
        // Where the water should go
        const getWaterDestination = () => {
            if (this.waterDestination[0] == 1) this.waterDestination[0] = this.cols - 1;
            if (this.waterDestination[1] == 1) this.waterDestination[1] = this.rows - 1;
            if (random(1) == 0) {
                this.waterDestination[0] = random(this.cols - 3) + 1;
            } else {
                this.waterDestination[1] = random(this.rows - 3) + 1;
            }
        }
        getWaterDestination();
        while (this.waterDestination.every((val, index) => val === this.waterSource[index])) {
            // keep generating waterdestinations until they don't intersect the watersource
            logger.debug(`Oops! Water destination had to change coords -- was ${this.waterDestination}`);
            getWaterDestination();
        }
        logger.info(`Water destination is ${this.waterDestination}`);
        
        // Tiles get added by world scene after this constructor, so delay the next function
        // which will make the water source non-clickable when the scene actually starts
        this.beforeMount(
            () => {
                const waterSourceUnderlyingTile = this.getWaterSourceUnderlyingTile();
                const waterSourceTile = new WaterSourceTileActor(game, this.waterSource, this.cols - 1, this.rows - 1)
                waterSourceUnderlyingTile.addChild(waterSourceTile);
                waterSourceUnderlyingTile.interactive = false;
                this.placeDestinationLine([this.waterDestination[1]], [this.waterDestination[0]]);
            }
        );

        // Create background rectangle behind the grid for extra decoration
        // It's only behind the grid because non-grid actors are mounted before the grid's actors
        // This is an implementation detail possible to change in a future version of muffin-game
        this.actors.background = new RectangleActor(game, (gridSize * 9) + 4, (gridSize * 6) + 4, 0xffffff, 0x000000);
        this.actors.background.x = 35;
        this.actors.background.y = 28;
        this.subcontainer.x = 37;
        this.subcontainer.y = 30;
    }

    getWaterSourceUnderlyingTile() {
        let waterSourceTile = this[this.waterSource[1]][this.waterSource[0]];
        if (waterSourceTile === undefined) {
            logger.error("the water source tile is undefined.");
            waterSourceTile = this[0][0];
        }
        return waterSourceTile;
    }

    getWaterSourceTile() {
        return this.getWaterSourceUnderlyingTile().children[0];
    }

    startWater() {
        if (!this.mounted) return;
        logger.info("Water source starting animation! 🌊");
        const waterSourceTile = this.getWaterSourceTile()
        waterSourceTile.startFlowAnimation();
        const waterSourceTileCoords = [waterSourceTile.gridy, waterSourceTile.gridx];

        // Double-check everything is sensible because errors will be harder to debug later
        if (!waterSourceTileCoords.every((val, index) => val === this.waterSource[index])) {
            logger.error("The water source tile is in the wrong spot. Everything's gonna break")
            logger.error(`actor coords: ${waterSourceTileCoords} -- gridscene coords: ${this.waterSource}`)
        }

        this.game.startTimer(() => {
            this.startFlowing();
        }, FLOW_DELAY);
    }

    startFlowing() {
        if (!this.mounted) return;
        const waterSourceTile = this.getWaterSourceTile();
        const [y, x] = getDirectionCoords(waterSourceTile.direction, waterSourceTile.gridy, waterSourceTile.gridx);
        logger.info(`WATER TIME! Starting a timer chain of flow() calls`);
        waterSourceTile.stopFlowAnimation();
        this.flow(waterSourceTile.direction, x, y);
    }

    flow(direction, x, y) {
        if (!this.mounted) return;
        // the x and y are backwards >:[ I suck
        // Coords are the water's next location
        logger.info(`Looking at x${x},y${y} for the next pipe!`);
        if (
            this._grid[x][y].children.length == 0 ||
            !this._grid[x][y].children[0].waterCanFlow(direction)
                ) {
            this.game.gameOver();
            return;
        }
        this.game.scene.score += 100;

        // Draw the water flowing
        const pipe = this._grid[x][y].children[0];
        const waterPipe = new Actor(this.game, pipe.texture);
        const waterHighlightPipe = new Actor(this.game, pipe.texture);
        waterHighlightPipe.alpha = 0.0;
        waterHighlightPipe.tint = 0x2377ff;
        waterHighlightPipe.blendMode = PIXI.BLEND_MODES.ADD;
        pipe.tint = 0x2377ff;
        pipe.parent.addChild(waterPipe)
        pipe.parent.addChild(waterHighlightPipe);
        const waterAnimate = (delta, keyboard) => {
            waterPipe.alpha -= delta / FLOW_DELAY;
            waterHighlightPipe.alpha += delta / FLOW_DELAY;
        }
        this.beforeTick(waterAnimate);
        this.game.startTimer(() => {
            // #TODO muffin-game needs a way to remove functions :)
            this._beforeTickFuncs = [];
        }, FLOW_DELAY);
        
        // Get next direction (check for the bendy pipes!)
        switch (pipe.variety) {
            case 0:
                // water flows up or right
                direction = direction == waterDirections.left ? 3 : 1;
                break;
            case 1:
                // water flows up or left
                direction = direction == waterDirections.right ? 3 : 0;
                break;
            case 2:
                // water flows down or left
                direction = direction == waterDirections.right ? 2 : 0;
                break;
            case 3:
                // water flows down or right
                direction = direction == waterDirections.left ? 2 : 1;
        }

        logger.info(`Next direction for water: ${waterDirections[direction]}`);
        const coords = getDirectionCoords(direction, y, x);
        const [newy, newx] = coords;

        // Check if water is going off-grid in the next step
        if (newx < 0 || newx == this.rows || newy < 0 || newy == this.cols) {
            // if we're on the waterDestination, we win!
            if (coords.some((val, index) => val === this.waterDestination[index])) {
                this.game.startTimer(() => {
                    this.game.scene.level++;
                    this.game.changeScene(new WorldScene(this.game, this.game.scene.score, this.game.scene.level));
                }, FLOW_DELAY);
                return;
            } else {
                logger.info("Waiting to die (good song by The Grammar Club btw)")
                this.game.startTimer(() => {
                    this.mounted && this.game.gameOver();
                }, FLOW_DELAY);
                return;
            }
        }

        this.game.startTimer(() => {
            this.flow(direction, newx, newy);
        }, FLOW_DELAY);
    }
    
    tick(delta, keyboard) {
        super.tick(delta, keyboard);
        if (logger.minimum < logger.level.error && keyboard.number == 7) {
            this.game.reset();
        }
    }

    placeDestinationLine(y, x) {
        let flowIndicator;
        if (y == 0 || y == this.rows - 1) {
            // vertical
            flowIndicator = new RectangleActor(this.game, 8, 65, 0xffffff, null);
            flowIndicator.x = -4;
            flowIndicator.y = 4;
        } else {
            // horizontal
            flowIndicator = new RectangleActor(this.game, 65, 8, 0xffffff, null);
            flowIndicator.x = 4;
            flowIndicator.y = -4;
        }
        this._grid[y][x].addChild(flowIndicator);
        if (y == this.rows - 1) {
            flowIndicator.x = 73 - 4;
        } else if (x == this.cols - 1) {
            flowIndicator.y = 73 - 4;
        }
    }
}
