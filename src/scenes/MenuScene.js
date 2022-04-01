import Scene from "muffin-game/scenes/Scene";
import { addNewMenuButtonsToScene } from "muffin-game/scenes/MenuScene"
import RectangleActor from "muffin-game/actors/RectangleActor";
import ButtonActor from "muffin-game/actors/ButtonActor";
import WorldScene from "./WorldScene";
import HelpScene from "./HelpScene";


export default class MenuScene extends Scene {
    sceneList = [
        [WorldScene, "Start Game"],
        [HelpScene, "How to Play"],
    ];

    constructor(game, options) {
        super(game, options);
        addNewMenuButtonsToScene(this);
        this.buttons[0].y -= 25;
        this.actors.fuel = game.sprites.fuel();
        this.actors.fuel.x = game.width / 2;
        this.actors.fuel.y = (game.height - this.actors.fuel.height) - 50;
        this.actors.fuel.anchor.x = 0.5;
        this.actors.fuel.anchor.y = 0.5;

        this.actors.titleText = new ButtonActor(game, RectangleActor, 550, 125, "Pipe Puzzle", {color: 0xffffff, fontSize: "96px"}, 0x6d4a82, 0x4e315e);
        this.actors.titleText.y = 100;
        this.actors.titleText.x = game.width / 2;
        this.actors.titleText.anchor.x = 0.5;
    }
    
    tick(delta, keyboard) {
        super.tick(delta, keyboard);
        this.actors.fuel.rotation += delta / 100;
    }
}
