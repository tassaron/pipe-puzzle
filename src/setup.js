import { createGame, getTexture } from "muffin-game/core/setuptools";
import Actor from "muffin-game/actors/Actor";
import AnimatedActor from 'muffin-game/actors/AnimatedActor';
import TileActor from "muffin-game/actors/TileActor";
import MyMenuScene from "./MenuScene";


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
    sprites.pipe = (game) => new TileActor(game, getTexture(resources.pipes.texture, "pipes"), 4, 4, 73);
};


createGame(textures, afterPreload, MyMenuScene);