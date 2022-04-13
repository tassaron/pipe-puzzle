import Scene from "muffin-game/scenes/Scene";
import RectangleActor from "muffin-game/actors/RectangleActor";
import ButtonActor from "muffin-game/actors/ButtonActor";
import { Pauser } from "muffin-game/scenes/PauseScene";
import { gameOverTick as nothingTick } from "muffin-game/core/game";
import { show_send_score_button, hide_send_score_button } from "../compat.rainey_arcade.js";


export default class GameOverScene extends Scene {
    pauser = new Pauser();

    constructor(game) {
        super(game, {});
        // The empty object tells muffin-game not to apply default options
        // which causes this scene not to unmount the previous scene when mounted
        this.actors.waterSpill = game.scene.grid.actors.waterSpill;
        this.actors.text = new ButtonActor(game, RectangleActor, 266, 133, "Game Over", {fill: 0xffffff}, 0x6d4a82, 0x4e315e);
        this.actors.text.anchor.x = 0.5;
        this.actors.text.anchor.y = 0.5;
        this.actors.text.interactive = true;
        this.actors.text.onTap((_) => game.reset());
        this.actors.text.alpha = 0.0;

        this.beforeMount.add(() => {
            this.actors.text.x = game.width(50);
            this.actors.text.y = game.height(50);
        });

        this.game.state.functions.tick = gameOverTick;
    }

    mount(container) {
        // The Pauser object allows us to disable clicking on elements
        // this is necessary because clicks/taps are handled by Pixi.js, not muffin-game
        this.pauser.pause(container);

        // Other lifecycle methods such as tick() are paused due to the `state function`
        // i.e, game.state.functions.tick() does not call game.scene.tick()
        super.mount(container);
    }

    unmount(container) {
        this.pauser?.unpause();
        hide_send_score_button();
        super.unmount(container);
    }
}


function gameOverTick(game, delta, keyboard) {
    // Call tick on the water spill and fade in text
    game.scene.actors.text.alpha = Math.min(game.scene.actors.text.alpha + (delta / 60), 1.0);
    game.scene.actors.waterSpill.tick(delta, keyboard);
    if (game.scene.actors.text.alpha == 1.0) {
        show_send_score_button(game.prevScene.score);
        game.state.functions.tick = nothingTick;
    }
}
