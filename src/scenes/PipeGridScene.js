import * as PIXI from "pixi.js";
import WaterSourceTileActor from "../actors/WaterSourceTileActor";
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
                const waterSourceTile = this.getWaterSourceTile();
                waterSourceTile.addChild(new WaterSourceTileActor(game));
                waterSourceTile.interactive = false;
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

    getWaterSourceTile() {
        let waterSourceTile = this[this.waterSource[1]][this.waterSource[0]];
        if (waterSourceTile === undefined) {
            logger.error(`The water source cell at x${this.waterSource[0]}, y${this.waterSource[1]} is undefined`);
            if (this._grid === undefined) logger.error("in fact, the entire grid is undefined.");
            waterSourceTile = this[0][0];
        }
        return waterSourceTile;
    }

    startWater() {
        logger.info("Water source starting! 🌊");
    }
}
