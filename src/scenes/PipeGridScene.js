import * as PIXI from "pixi.js";
import WaterSourceTileActor, { getDirectionCoords, waterDirections } from "../actors/WaterSourceTileActor";
import EmptyPipeTileActor from "../actors/EmptyPipeTileActor";
import RectangleActor from "muffin-game/actors/RectangleActor";
import GridScene from "muffin-game/grids/GridScene";
import { createGrid } from "muffin-game/grids/Grid";
import { logger } from "muffin-game/core/logger";


logger.LOGLEVEL = 1;


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
        
        // Make secondary grid to store waterlogged pipes
        this.waterPipes = createGrid(this.cols, this.rows);

        // Where the water starts
        this.waterSource = [Math.floor(Math.random() * this.cols), Math.floor(Math.random() * this.rows)];

        // Tiles get added by world scene after this constructor, so delay the next function
        // which will make the water source non-clickable when the scene actually starts
        this.beforeMount(
            () => {
                const waterSourceUnderlyingTile = this.getWaterSourceUnderlyingTile();
                const waterSourceTile = new WaterSourceTileActor(game, this.waterSource, this.cols - 1, this.rows - 1)
                waterSourceUnderlyingTile.addChild(waterSourceTile);
                waterSourceUnderlyingTile.interactive = false;
            }
        );

        // Create background rectangle behind the grid for extra decoration
        // It's only behind the grid because non-grid actors are mounted before the grid's actors
        // This is an implementation detail possible to change in a future version of muffin-game
        this.actors.background = new RectangleActor(game, (73 * 9) + 4, (73 * 6) + 4, 0xffffff, 0x000000);
        this.actors.background.x = 35;
        this.actors.background.y = 28;
        this.subcontainer.x = 37;
        this.subcontainer.y = 30;
    }

    getWaterSourceUnderlyingTile() {
        let waterSourceTile = this[this.waterSource[1]][this.waterSource[0]];
        if (waterSourceTile === undefined) {
            
            if (this._grid === undefined) logger.error("in fact, the entire grid is undefined.");
            waterSourceTile = this[0][0];
        }
        return waterSourceTile;
    }

    getWaterSourceTile() {
        return this.getWaterSourceUnderlyingTile().children[0];
    }

    startWater() {
        logger.info("Water source starting animation! 🌊");
        const waterSourceTile = this.getWaterSourceTile()
        waterSourceTile.startFlowAnimation();
        const waterSourceTileCoords = [waterSourceTile.gridy, waterSourceTile.gridx];

        // Double-check everything is sensible because errors will be harder to debug later
        if (!waterSourceTileCoords.every((val, index) => val === this.waterSource[index])) {
            logger.error("The water source tile is in the wrong spot. Everything's gonna break")
            logger.error(`actor coords: ${waterSourceTileCoords} -- gridscene coords: ${this.waterSource}`)
        }

        this.waterPipes[this.waterSource[0]][this.waterSource[1]] = true;
        //console.log(this.waterPipes);
        //console.log(this._grid);
        this.game.startTimer(() => {
            this.startFlowing();
        }, 254.0);
    }

    startFlowing() {
        if (!this.mounted) return;
        const waterSourceTile = this.getWaterSourceTile();
        const [y, x] = getDirectionCoords(waterSourceTile.direction, waterSourceTile.gridy, waterSourceTile.gridx);
        logger.info(`WATER TIME! Looking at x${x},y${y} for the first pipe!`);
        waterSourceTile.stopFlowAnimation();
        this.flow(waterSourceTile.direction, x, y);
    }

    flow(direction, x, y) {
        if (!this.mounted) return;
        // the x and y are backwards >:[ I suck
        // Coords are the water's current location
        if (
            this._grid[x][y].children.length == 0 ||
            !this._grid[x][y].children[0].waterCanFlow(direction)
                ) {
            this.game.gameOver();
            return;
        }
        
        // Get new coords, where water is going next
        let [newy, newx] = getDirectionCoords(direction, y, x);
        logger.info(`Looking at x${newx},y${newy} for the next pipe!`);
        // Draw the water flowing
        const pipe = this._grid[x][y].children[0];
        pipe.tint = 0x0000ff;

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
        [newy, newx] = getDirectionCoords(direction, y, x);
        this.game.startTimer(() => {
            this.flow(direction, newx, newy);
        }, 254.0);   
    }

    tick(delta, keyboard) {
        super.tick(delta, keyboard);
        if (keyboard.number == 7) {
            this.game.reset();
        }
    }
}
