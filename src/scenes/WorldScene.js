import { newBackButton } from "muffin-game/scenes/MenuScene";
import Scene from "muffin-game/scenes/Scene";
import PipeGridScene from "./PipeGridScene";
import PipeTroughScene from "./PipeTroughScene";
import MenuScene from "./MenuScene";
import ButtonActor from "muffin-game/actors/ButtonActor";
import RectangleActor from "muffin-game/actors/RectangleActor";


const LEVEL_DELAY_TIME = 60.0;
const LEVEL_DELAY_MAX = LEVEL_DELAY_TIME * 10;


export default class WorldScene extends Scene {
    score = 0;
    level = 0;
    timer = -1;
    oldScore = 0;
    oldLevel = 0;
    
    constructor(game, score = 0, level = 0) {
        super(game);
        this.score = score;
        this.level = level;
        this.actors.backButton = newBackButton(game, MenuScene);
        
        // Create subscenes
        this.grid = new PipeGridScene(game);
        this.trough = new PipeTroughScene(game);
        this.subscenes = [this.grid, this.trough];

        // Add click/tap events to all grid tiles (the `EmptyPipeTileActor`s)
        for (let x = 0; x < this.grid.cols; x++) {
            for (let y = 0; y < this.grid.rows; y++) {
                this.grid[y][x].interactive = true;
                this.grid[y][x].pointertap = (e) => {
                    if (!this.grid.mounted) return;
                    // Get pipe actor from PipeTroughScene
                    const pipe = this.trough.getNextPipe();

                    // Add pipe actor as child of the EmptyPipeTileActor
                    if (this.grid[y][x].children.length > 0) {
                        // The destination tile already has a child
                        // so if player clicks this tile, remove that child first
                        // this way the pipe is always at index 0, keeping it simple!
                        const oldChild = this.grid[y][x].children[0];
                        this.grid[y][x].removeChild(oldChild);
                        this.grid[y][x].addChild(pipe);
                        this.grid[y][x].addChild(oldChild);
                    } else {
                        this.grid[y][x].addChild(pipe);
                    }
                    // The EmptyPipeTileActor is no longer clickable
                    this.grid[y][x].interactive = false;
                    // The pipe actor's x and y is relative to the parent
                    pipe.y = 0;
                    pipe.x = 0;
                };
            }
        }
        this.createTextActors();
        this.beforeMount(() => {
            this.startWaterTimer();
        });
    }

    startWaterTimer() {
        const flowDelay = Math.max(LEVEL_DELAY_MAX - (this.level * LEVEL_DELAY_TIME), 0.0);
        this.timer = this.game.startTimer(
            () => {
                this.grid.startWater();
                this.timer = -1;
            },
            flowDelay,
            "initial flow grow"
        );
        this.beforeUnmount(() => {
            if (this.timer > -1) this.game.stopTimer(this.timer)
        });
    }

    createTextActors() {
        this.actors.scoreText = new ButtonActor(this.game, RectangleActor, 175, 50, `Score: ${this.score}`, {}, 0x6d4a82, 0x4e315e);
        this.actors.scoreText.x = 125;
        this.actors.scoreText.y = this.game.height - 50;
        this.actors.levelText = new ButtonActor(this.game, RectangleActor, 175, 50, `Level: ${this.level + 1}`, {}, 0x6d4a82, 0x4e315e);
        this.actors.levelText.x = this.game.width - 125;
        this.actors.levelText.y = this.game.height - 50;
    }

    tick(delta, keyboard) {
        super.tick(delta, keyboard);
        if (this.score != this.oldScore || this.level != this.oldLevel) {
            if (!this.mounted) return;
            this.mounted.removeChild(this.actors.scoreText);
            this.mounted.removeChild(this.actors.levelText);
            this.createTextActors();
            this.mounted.addChild(this.actors.scoreText);
            this.mounted.addChild(this.actors.levelText);
        }
        if (this.score != this.oldScore) {
            this.oldScore = Number(this.score);
        }
        if (this.level != this.oldLevel) {
            this.oldLevel = Number(this.level);
        }
    }
}
