import { logger } from "../logger";
import { newBackButton } from "muffin-game/scenes/MenuScene";
import Scene from "muffin-game/scenes/Scene";
import PipeGridScene from "./PipeGridScene";
import PipeTroughScene from "./PipeTroughScene";
import MenuScene from "./MenuScene";
import ButtonActor from "muffin-game/actors/ButtonActor";
import RectangleActor from "muffin-game/actors/RectangleActor";
import FfwdButtonActor from "../actors/FfwdButtonActor";
import ScoreNotifActor from "../actors/ScoreNotifActor";
import ScoreTextActor from "../actors/ScoreTextActor";


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

        // Fast-forward button
        this.actors.ffwdButton = new FfwdButtonActor(game);
        this.actors.ffwdButton.x = game.width - 36;
        this.actors.ffwdButton.y = 36;
        this.actors.ffwdButton.anchor.x = 0.5;
        this.actors.ffwdButton.anchor.y = 0.5;
        this.actors.ffwdButton.interactive = true;
        
        // Create subscenes
        this.grid = new PipeGridScene(game);
        this.trough = new PipeTroughScene(game);
        
        // A function that places `PipeTileActor`s on top of `EmptyPipeTileActor`s
        const placePipe = (x, y) => {
            if (!this.grid.mounted) return;
            // Get PipeTileActor from PipeTroughScene
            const pipeId = this.trough.getNextPipe();
            const pipe = this.trough.actors[pipeId];
            
            // Add PipeTileActor as child of the EmptyPipeTileActor
            if (this.grid[y][x].children.length > 0) {
                // The waterDestination tile already has a child
                // so if player clicks this tile, remove that child first
                // this way the PipeTileActor is always at index 0, keeping it simple!
                const oldChild = this.grid[y][x].children[0];
                this.grid[y][x].removeChild(oldChild);
                this.grid[y][x].addChild(pipe);
                this.grid[y][x].addChild(oldChild);
            } else {
                this.grid[y][x].addChild(pipe);
            }
            this.grid[y][x].wiggle();
            // The EmptyPipeTileActor is no longer clickable
            this.grid[y][x].interactive = false;
            // The PipeTileActor's x and y is relative to the parent
            pipe.y = 0;
            pipe.x = 0;
            pipe.gridx = x;
            pipe.gridy = y;
            // Now the player can click the PipeTileActor to destroy it
            pipe.interactive = true;
            pipe.pointertap = (e) => {
                pipe.explode(pipeId, this.trough);
                placePipe(x, y);
                this.score = Math.max(this.score - 100, 0);
            };
        };
        
        // Add click/tap events to all grid tiles (the `EmptyPipeTileActor`s)
        for (let x = 0; x < this.grid.cols; x++) {
            for (let y = 0; y < this.grid.rows; y++) {
                this.grid[y][x].interactive = true;
                this.grid[y][x].pointertap = (e) => placePipe(x, y);
            }
        }
        this.subscenes = [this.grid, this.trough];
        
        // Create score/level text
        this.createTextActors(false);
        
        // Start the water timer later, before the scene is mounted
        this.beforeMount.add(() => {
            this.startWaterTimer();
        });

        // Reset game speed when leaving this scene
        this.beforeUnmount.add(() => {
            this.actors.ffwdButton.setGameSpeed(1);
            logger.info("Reset game speed to 1");
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
        this.grid.beforeMount.add(() => this.grid.startWaterTimer(flowDelay));
        this.beforeUnmount.add(() => {
            if (this.timer > -1) this.game.stopTimer(this.timer)
        });
    }

    createTextActors(wiggle=true) {
        this.actors.scoreText = new ScoreTextActor(this.game, RectangleActor, 175, 50, `Score: ${this.score}`, {fill: 0xffffff}, 0x6d4a82, 0x4e315e);
        if (!wiggle) this.actors.scoreText.wiggle.direction = 2;
        this.actors.scoreText.x = 125;
        this.actors.scoreText.y = this.game.height - 50;
        this.actors.levelText = new ButtonActor(this.game, RectangleActor, 175, 50, `Level: ${this.level + 1}`, {fill: 0xffffff}, 0x6d4a82, 0x4e315e);
        this.actors.levelText.x = this.game.width - 125;
        this.actors.levelText.y = this.game.height - 50;
    }

    newScoreNotif(difference) {
        const id = this.addActors(new ScoreNotifActor(this.game, difference))[0];
        const actor = this.actors[id];
        this.actors.scoreText.addChild(actor);
        actor.x = 0;
        actor.y = 0;
    }

    tick(delta, keyboard) {
        super.tick(delta, keyboard);
        if (this.mounted == null || (this.score == this.oldScore && this.level == this.oldLevel)) {
            return;
        }
        this.actors.scoreText.destroy();
        this.actors.levelText.destroy();
        this.createTextActors();
        this.mounted.addChild(this.actors.scoreText);
        this.mounted.addChild(this.actors.levelText);
        if (this.score != this.oldScore) {
            this.newScoreNotif(this.score - this.oldScore);
            this.oldScore = Number(this.score);
        }
        if (this.level != this.oldLevel) {
            this.oldLevel = Number(this.level);
        }
    }

    resize(){}
}
