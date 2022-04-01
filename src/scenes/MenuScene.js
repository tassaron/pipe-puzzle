import Scene from "muffin-game/scenes/Scene";
import { addNewMenuButtonsToScene } from "muffin-game/scenes/MenuScene"
import RectangleActor from "muffin-game/actors/RectangleActor";
import WorldScene from "./WorldScene";
import GameOverScene from "./GameOverScene";
import HelpScene from "./HelpScene";


export default class MenuScene extends Scene {
    sceneList = [
        [WorldScene, "Start Game"],
        [HelpScene, "How to Play"],
    ];

    constructor(game, options) {
        game.gameOverScene = GameOverScene;
        super(game, options);
        addNewMenuButtonsToScene(this);
        this.buttons[0].y -= 50;
        this.actors.fuel = game.sprites.fuel();
        this.actors.fuel.x = game.width / 2;
        this.actors.fuel.y = (game.height - this.actors.fuel.height) - 50;
        this.actors.square = new RectangleActor(game, 50, 50);
        this.actors.square.x = 100;
        this.actors.square.y = 100;
    }
    
    tick(delta, keyboard) {
        super.tick(delta, keyboard);
        this.actors.fuel.rotation += delta / 100;
    }
}
