import Scene from "muffin-game/scenes/Scene";
import { newMenuButtons, placeMenuButtons } from "muffin-game/scenes/MenuScene"
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
        
        // Make 3 stationary rotating pipes
        let pipe;
        for (let i = -300; i < 500; i += 200) {
            pipe = game.sprites.decoration();
            pipe.x = (game.width / 2) + i;
            pipe.y = (game.height - pipe.height) - 50;
            pipe.anchor.x = 0.5;
            pipe.anchor.y = 0.5;
            this.bouncers.push(pipe);
        }
        
        // Make some pipes that will bounce around
        let bouncer;
        for (let i = 0; i < 5; i++) {
            bouncer = game.sprites.decoration();
            bouncer.dx = Math.min(0.5, Math.random() + 0.2);
            bouncer.dy = Math.max(-1.0, Math.random() - 0.2);
            bouncer.x = 200 + (76 * i);
            bouncer.y = 90;
            bouncer.anchor.x = 0.5;
            bouncer.anchor.y = 0.5;
            this.bouncers.push(bouncer);
        }
        this.addActors(this.bouncers);
        this.actors.titleText = new ButtonActor(game, RectangleActor, 550, 125, "Pipe Puzzle", {fill: 0xffffff, fontSize: "96px"}, 0x6d4a82, 0x4e315e);
        this.actors.titleText.anchor.x = 0.5;

        newMenuButtons(this);
        this.beforeMount.add(() => placeMenuButtons(this));
        this.beforeMount.add(() => {
            this.buttons[0].y -= 25;
            this.actors.titleText.y = 100;
            this.actors.titleText.x = this.game.width / 2;
        });
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
                        this.bouncers[j].dx = Number(this.bouncers[i].dx);
                        this.bouncers[j].dy = Number(this.bouncers[i].dy);
                    }
                    this.bouncers[i].dx = -this.bouncers[i].dx;
                    this.bouncers[i].dy = -this.bouncers[i].dy;
                    if (this.bouncers[i].collision.overlap < -82) this.bouncers[i].explode(i);
                }
            }
        }
    }
}
