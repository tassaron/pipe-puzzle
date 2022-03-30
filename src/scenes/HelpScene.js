import Scene from "muffin-game/scenes/Scene";
import { newBackButton } from "muffin-game/scenes/MenuScene";
import MyMenuScene from "./MenuScene";


export default class HelpScene extends Scene {
    constructor(game) {
        super(game);
        this.actors.backButton = newBackButton(game, MyMenuScene);
    }
}