import Scene from "muffin-game/scenes/Scene";
import { newBackButton } from "muffin-game/scenes/MenuScene";
import { Ball } from "muffin-game/examples/BallsScene";
import RectangleActor from "muffin-game/actors/RectangleActor";
import EllipseActor from "muffin-game/actors/EllipseActor";
import MyMenuScene from "./MenuScene";


export default class WorldScene extends Scene {
    constructor(game) {
        super(game);
        this.actors.backButton = newBackButton(game, MyMenuScene);
        this.balls = [
            new Ball(game, new EllipseActor(game, 30, 30, 0x666666, null), 60, 60),
            new Ball(game, new RectangleActor(game, 60, 60, 0x666666, 0x000000), 60, 60),
            new Ball(game, game.sprites.explosion(), 60, 60)
        ]
        this.addActors(this.balls);
        this.placeBalls();
    }

    placeBalls() {
        for (let ball of this.balls) {
            ball.x = Math.min(Math.max(60, Math.random() * this.game.width), this.game.width - 60);
            ball.y = Math.min(Math.max(60, Math.random() * this.game.height), this.game.height - 60);
            ball.dx = Math.max(Math.random() * 10, 1.0);
            ball.dy = Math.max(Math.random() * 10, 1.0);
        }
    }
}