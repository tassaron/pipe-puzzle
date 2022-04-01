import Scene from "muffin-game/scenes/Scene";
import RectangleActor from "muffin-game/actors/RectangleActor";
import ButtonActor from "muffin-game/actors/ButtonActor";
import { Pauser } from "muffin-game/scenes/PauseScene";


export default class GameOverScene extends Scene {
    pauser = null;

    constructor(game) {
        super(game, {});
        // The empty object tells muffin-game not to apply default options
        // which causes this scene not to unmount the previous scene when mounted
        this.actors.text = new ButtonActor(game, RectangleActor, 266, 133, "Game Over", null, 0x933ed3, 0x000000);
        this.actors.text.anchor.x = 0.5;
        this.actors.text.anchor.y = 0.5;
        this.actors.text.x = game.width / 2;
        this.actors.text.y = game.height / 2;
        this.actors.text.interactive = true;
        this.actors.text.pointertap = (_) => game.reset();
    }

    mount(container) {
        // The Pauser object allows us to disable clicking on elements
        // this is necessary because clicks/taps are handled by Pixi.js, not muffin-game
        this.pauser = new Pauser(container);
        this.pauser.pause();
        // Other lifecycle methods such as tick() are paused due to the `state function`
        // i.e, game.state.functions.tick() does not call game.scene.tick()
        super.mount(container);
    }

    unmount(container) {
        this.pauser?.unpause();
        super.unmount(container);
    }
}