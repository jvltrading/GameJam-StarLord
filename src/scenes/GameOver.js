import Phaser from "../lib/phaser.js";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  preload() {

    this.load.image("gameover", "assets/gameover_text.png");

    
  }

  create() {
  

    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 3.5;

    const gameover = this.add.image(screenCenterX, screenCenterY, "gameover");

    this.tweens.add({
      targets: [gameover],
      y: 250,
      duration: 1500,
      ease: "Sine.easeInOut",
      loop: -1,
      yoyo: true,
    });
    

    const replay = this.add
    .text(1280/2, 500, "Replay", {
      fontSize: "50px",
      fontFamily: "Galactic",
    })
    .setOrigin(0.5)
    .setStroke("navy", 22)
    .setShadow(2, 2, "#333333", 5, true, true)
    .setInteractive({ useHandCursor: true })

    replay.on("pointerup", () => {
      this.game.sound.stopAll()
      this.scene.start('Game')
    })
 
  }

  update() {

  }
}
