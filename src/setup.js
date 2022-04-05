import * as PIXI from "pixi.js";
import { createGame, getTexture } from "muffin-game/core/setuptools";
import AnimatedActor from 'muffin-game/actors/AnimatedActor';
import PipeTileActor from "./actors/PipeTileActor";
import MenuDecorationActor from "./actors/MenuDecorationActor";
import Game from "muffin-game/core/game";
import MenuScene from "./scenes/MenuScene";
import GameOverScene from "./scenes/GameOverScene";


Game.entryScene = MenuScene;
Game.gameOverScene = GameOverScene;


const textures = [
    "explosion",
    "pipes",
];


function afterPreload(loader, resources, sprites) {
    // animated sprite
    sprites.explosion = (game) => new AnimatedActor(game, getTexture(resources.explosion.texture, "explosion"), 32, 32, 5, 4);

    // tilemap
    sprites.pipe = (game) => new PipeTileActor(game, getTexture(resources.pipes.texture, "pipes"));

    // pipe with collision, for decoration on MenuScene
    sprites.decoration = (game) => new MenuDecorationActor(game, getTexture(resources.pipes.texture, "pipes"));
};


createGame(textures, afterPreload);