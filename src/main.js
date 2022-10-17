import Phaser from "./lib/phaser.js";
import Game from "./scenes/Game.js";
import PauseScene from "./scenes/PauseScene.js";
import Landing from "./scenes/Landing.js";
import Instructions from "./scenes/Instructions.js";
import DustPhaserPlugin from "./lib/dust-phaser-plugin.js";
import GameOver from "./scenes/GameOver.js";
var windowWidth = window.innerWidth;
var widnowHeight = window.innerHeight;

var config = {
  type: Phaser.AUTO,
  mode: Phaser.Scale.ScaleModes.FIT,
  parent: "phaser-example",
  width: 1280,
  height: 720,
  scene: [Landing, Instructions, Game, PauseScene, GameOver],
  plugins: {
    scene: [{ key: "DustPlugin", plugin: DustPhaserPlugin, mapping: "dust" }],
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
};

export default new Phaser.Game(config);
