import Scene from "muffin-game/scenes/Scene";
import { newBackButton } from "muffin-game/scenes/MenuScene";
import MenuScene from "./MenuScene";
import EllipseActor from "muffin-game/actors/EllipseActor";
import ButtonActor from "muffin-game/actors/ButtonActor";


export default class HelpScene extends Scene {
    constructor(game) {
        super(game);
        this.actors.backButton = newBackButton(game, (game) => new MenuScene(game));
        this.actors.helpText = new ButtonActor(game, EllipseActor, 325, 125, "water should flow!", {fontSize: "48px"}, 0x2187d9, null);
        this.actors.helpText.anchor.x = 0.5;
        this.actors.helpText.anchor.y = 0.5;
        this.actors.helpText.x = game.width(50);
        this.actors.helpText.y = game.height(50);
    }
}
