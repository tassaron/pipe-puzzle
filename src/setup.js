import { createGame, getTexture } from "muffin-game/core/setuptools";
import Actor from "muffin-game/actors/Actor";
import AnimatedActor from 'muffin-game/actors/AnimatedActor';
import PipeTileActor from "./actors/PipeTileActor";
import Game from "muffin-game/core/game";
import MenuScene from "./scenes/MenuScene";
import GameOverScene from "./scenes/GameOverScene";


Game.entryScene = MenuScene;
Game.gameOverScene = GameOverScene;


const textures = [
    "explosion",
    "fuel",
    "pipes",
];


function afterPreload(loader, resources, sprites) {
    // sprite
    sprites.fuel = (game) => new Actor(game, getTexture(resources.fuel.texture, "fuel"));

    // animated sprite
    sprites.explosion = (game) => new AnimatedActor(game, getTexture(resources.explosion.texture, "explosion"), 32, 32, 5, 4);

    // tilemap
    sprites.pipe = (game) => new PipeTileActor(game, getTexture(resources.pipes.texture, "pipes"));
};


createGame(textures, afterPreload);