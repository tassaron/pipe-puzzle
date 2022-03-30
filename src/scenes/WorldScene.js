import * as PIXI from "pixi.js";
import { logger } from "muffin-game/core/logger";
import { newBackButton } from "muffin-game/scenes/MenuScene";
import Scene from "muffin-game/scenes/Scene";
import PipeGridScene from "./PipeGridScene";
import PipeTroughScene from "./PipeTroughScene";
import MyMenuScene from "./MenuScene";


export default class WorldScene extends Scene {
    levelTimers = [480.0, 240.0, 120.0];
    level = 0;
    timer = -1;

    constructor(game) {
        super(game);
        this.actors.backButton = newBackButton(game, MyMenuScene);
        this.grid = new PipeGridScene(game);

        this.trough = new PipeTroughScene(game);
        for (let x = 0; x < this.grid.cols; x++) {
            for (let y = 0; y < this.grid.rows; y++) {
                this.grid._grid[y][x].interactive = true;
                this.grid._grid[y][x].pointertap = (e) => {
                    if (!this.grid.mounted) return;
                    const pipe = this.trough.getNextPipe();
                    this.grid._grid[y][x].addChild(pipe);
                    this.grid._grid[y][x].interactive = false;
                    pipe.y = 0;
                    pipe.x = 0;
                };
            }
        }
        this.beforeMount(() => this.startWaterTimer());
        this.subscenes = [this.grid, this.trough];
    }

    startWaterTimer() {
        this.timer = this.game.startTimer(
            () => {
                this.grid.startWater();
                this.timer = -1;
            },
            this.levelTimers[this.level]
        );
        this.beforeUnmount(() => {
            if (this.timer > -1) this.game.stopTimer(this.timer)
        });
    }
}
