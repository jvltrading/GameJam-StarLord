import Phaser from "../lib/phaser.js";
import { preload, addLaser } from "../lib/laser.js";

export default class Landing extends Phaser.Scene {
  constructor() {
    super("landing");
  }

  preload() {
    this.load.image("bg", "assets/landing.png");
    this.load.image("logo", "assets/thelogo.png");
    this.load.audio("theme", "assets/audio/Kate Bush - theme.mp3");
    this.load.atlas("flares", "assets/flares.png", "assets/flares.json");
    // this.load.plugin({
    //   key: "PathBuilder.min",
    //   url: "src/lib/PathBuilder.min.js",
    //   mapping: "PathBuilder",
    // });

    preload(this, [
      {
        path_key: "beam",
        path: "assets/paths/beam.json",
      },
      {
        path_key: "top_beam",
        path: "assets/paths/top_beam.json",
      },
      {
        path_key: "left_beam",
        path: "assets/paths/side_beam.json",
      },
      {
        path_key: "right_beam",
        path: "assets/paths/beam_side.json",
      },
    ]);
  }

  create() {
    this.scale.refresh();

    const bg = this.add.image(1280 / 2, 720 / 2, "bg");
    bg.setDisplaySize(1280, 720);

    const music = this.sound.add("theme");
    music.volume = 0.1;
    music.play({ loop: true });

    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 3;

    const gameName1 = this.add.image(screenCenterX, screenCenterY, "logo");

    gameName1.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
    gameName1.setAngle(-3);

    const startButton = this.add
      .text(650, 500, "Start game", {
        fontSize: "50px",
        fontFamily: "impact",
      })
      .setOrigin(0.5)
      .setStroke("navy", 22)
      .setShadow(2, 2, "#333333", 5, true, true)
      .setInteractive({ useHandCursor: true });

    startButton.on("pointerup", () => {
      music.stop();
      this.scene.start("Game");
    });

    const instructionButton = this.add
      .text(650, 600, "How to play", {
        fontSize: "50px",
        fontFamily: "impact",
      })
      .setOrigin(0.5)
      .setStroke("navy", 22)
      .setShadow(2, 2, "#333333", 5, true, true)
      .setInteractive({ useHandCursor: true });

    instructionButton.on("pointerup", () => {
      music.stop();
      this.scene.start("Instructions");
    });

    this.tweens.add({
      targets: [gameName1],
      y: 300,
      duration: 1500,
      ease: "Sine.easeInOut",
      loop: -1,
      yoyo: true,
    });

        // add laser
        addLaser(this,{
          path_key: 'beam',
          colours: ['blue'],
          start: 0.1,
          end: 0.1,
          quantity: 48,
          yoyo: false,
          particle_key: 'flares'
      })

      addLaser(this,{
        path_key: 'top_beam',
        colours: ['blue'],
        start: 0.1,
        end: 0.1,
        quantity: 48,
        yoyo: false,
        particle_key: 'flares'
    })

      addLaser(this,{
        path_key: 'left_beam',
        colours: ['red'],
        start: 0.1,
        end: 0.1,
        quantity: 48,
        yoyo: false,
        particle_key: 'flares'
    })

    addLaser(this,{
      path_key: 'right_beam',
      colours: ['red'],
      start: 0.1,
      end: 0.1,
      quantity: 48,
      yoyo: false,
      particle_key: 'flares'
  })
  }

  update() {}
}
