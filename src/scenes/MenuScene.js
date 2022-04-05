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
    bouncers = [];

    constructor(game, options) {
        super(game, options);
        
        // Make a stationary rotating pipe
        this.actors.pipe = game.sprites.decoration();
        this.actors.pipe.x = game.width / 2;
        this.actors.pipe.y = (game.height - this.actors.pipe.height) - 50;
        this.actors.pipe.anchor.x = 0.5;
        this.actors.pipe.anchor.y = 0.5;
        
        // Make some pipes that will bounce around
        let bouncer;
        for (let i = 0; i < 3; i++) {
            bouncer = game.sprites.decoration();
            bouncer.dx = Math.min(0.5, Math.random() + 0.2);
            bouncer.dy = Math.max(-1.0, Math.random() - 0.2);
            bouncer.x = 330 + (76 * i);
            bouncer.y = 90;
            bouncer.anchor.x = 0.5;
            bouncer.anchor.y = 0.5;
            this.bouncers.push(bouncer);
        }
        this.addActors(this.bouncers);
        this.bouncers.push(this.actors.pipe);

        addNewMenuButtonsToScene(this);
        this.buttons[0].y -= 25;
        
        this.actors.titleText = new ButtonActor(game, RectangleActor, 550, 125, "Pipe Puzzle", {color: 0xffffff, fontSize: "96px"}, 0x6d4a82, 0x4e315e);
        this.actors.titleText.y = 100;
        this.actors.titleText.x = game.width / 2;
        this.actors.titleText.anchor.x = 0.5;
    }
    
    tick(delta, keyboard) {
        super.tick(delta, keyboard);
        for (let i = 0; i < this.bouncers.length; i++) {
            this.bouncers[i].rotation += delta / 100;
        }

        // check for bouncer collisions
        const collisions = new Set();
        for (let i = 0; i < this.bouncers.length; i++) {
            for (let j = 0; j < this.bouncers.length; j++) {
                if (i == j || collisions.has(j)) continue;
                collisions.add([i, j]);
                if (this.bouncers[i].collision.collides(this.bouncers[j].collision)) {
                    if (this.bouncers[j].dx == 0.0) {
                        this.bouncers[j].dx = this.bouncers[i].dx;
                        this.bouncers[j].dy = this.bouncers[i].dy;
                        continue;
                    }
                    this.bouncers[i].dx = -this.bouncers[i].dx;
                    this.bouncers[i].dy = -this.bouncers[i].dy;
                }
            }
        }
    }
}
