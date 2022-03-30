import Scene from "muffin-game/scenes/Scene";
import { addNewMenuButtonsToScene, ExampleSceneList } from "muffin-game/scenes/MenuScene"
import RectangleActor from "muffin-game/actors/RectangleActor";
import WorldScene from "./WorldScene";


export default class MyMenuScene extends Scene {
    sceneList = [[WorldScene, "Start Game"]];

    constructor(game, options) {
        super(game, options);
        addNewMenuButtonsToScene(this);
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