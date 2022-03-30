import * as PIXI from "pixi.js";
import Scene from "muffin-game/scenes/Scene";
import { newBackButton } from "muffin-game/scenes/MenuScene";
import PipeGridScene from "./PipeGridScene";
import MyMenuScene from "./MenuScene";


export default class WorldScene extends Scene {
    constructor(game) {
        super(game);
        this.actors.backButton = newBackButton(game, MyMenuScene);
        this.grid = new PipeGridScene(game);
        for (let x = 0; x < this.grid.cols; x++) {
            for (let y = 0; y < this.grid.rows; y++) {
                this.grid._grid[y][x].interactive = true;
                this.grid._grid[y][x].pointertap = (e) => {
                    if (!this.grid.mounted) return;
                    const pipe = game.sprites.pipe();
                    this.grid._grid[y][x].addChild(pipe);
                    this.grid.addActors([pipe]);
                    this.grid._grid[y][x].interactive = false;
                };
            }
        }
        this.subscenes = [this.grid];
    }
}