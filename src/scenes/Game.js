import Phaser from "../lib/phaser.js";

var cursors;
export default class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  preload() {
    this.load.image("background", ["assets/game_scene_background.jpg"]);
    this.load.image("ground", ["assets/platform.png"]);
    this.load.image("spike", "assets/spike.png");
    this.load.image("spike_down", "assets/spike_down.png");
    this.load.image("spike_left", "assets/spike_left.png");
    this.load.image("spike_right", "assets/spike_right.png");
    this.load.image("single_spike_down", "assets/single_spike_down.png");
    this.load.image("single_spike_up", "assets/single_spike_up.png");
    this.load.image("single_spike_left", "assets/single_spike_left.png");
    this.load.image("single_spike_right", "assets/single_spike_right.png");
    this.load.image("orb1", "assets/orb_1.png");
    this.load.image("orb2", "assets/orb_2.png");
    this.load.image("orb3", "assets/orb_3.png");
    this.load.image("star", ["assets/star.png"]);
    this.load.image("floor", "assets/floor.png");
    this.load.image("pause_button", "assets/pause.png");
    this.load.image("home_button", "assets/home.png");
    this.load.image("restart_button", "assets/restart.png");
    this.load.audio("pickup", "assets/audio/pickup.wav");
    this.load.audio("end_game", "assets/audio/endgame.wav");
    this.load.audio("ingame", "assets/audio/game_music.mp3");
    // this.load.plugin({key:'PathBuilder.min', url:"src/lib/PathBuilder.min.js",mapping:'PathBuilder'});
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.sceneFile("GameOver", "./GameOver.js");
  }

  create() {
    this.level = 1;

    this.background = this.add
      .sprite(1280 / 2, 720 / 2, "background")
      .setPipeline("Light2D")
      .setAlpha(0.05);
    this.background.setDisplaySize(1280, 720);

    let floor = this.add
      .image(1280 / 2, 700, "floor")
      .setPipeline("Light2D")
      .setAlpha(0.5);
    this.physics.add.existing(floor, true);

    this.platforms = this.physics.add.staticGroup();
    this.spikes = this.physics.add.staticGroup();

    this.loadPlatforms();

    this.num_stars = 0;

    let pause_button = this.add
      .sprite(20, 20, "pause_button")
      .setInteractive({ useHandCursor: true });
    pause_button.scale = 0.2;

    pause_button.on("pointerdown", () => {
      this.scene.launch("PauseScene");
      this.game_music.pause();
      this.scene.pause();
      pause_button.visible = false;
    });

    this.events.on("resume", () => {
      this.game_music.resume();
      pause_button.visible = true;
    });

    let home_button = this.add
      .sprite(55, 20, "home_button")
      .setInteractive({ useHandCursor: true });
    home_button.scale = 0.25;

    home_button.on("pointerdown", () => {
      if (this.scene.isActive("GameOver")) {
        this.scene.stop("GameOver");
      }
      this.game_music.stop();
      this.scene.launch("landing");
      this.scene.stop();
    });

    let restart_button = this.add
      .sprite(100, 20, "restart_button")
      .setInteractive({ useHandCursor: true });
    restart_button.scale = 0.25;

    restart_button.on("pointerdown", () => {
      if (this.scene.isActive("GameOver")) {
        this.scene.stop("GameOver");
      }
      this.game_music.stop();
      this.scene.restart();
    });

    this.lights.enable();
    this.lights.setAmbientColor(0x808080);
    this.spotlight = this.lights.addLight(400, 300, 150).setIntensity(100);

    this.stars = this.physics.add.group();
    this.loadStars();
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.stars, floor);

    this.player = this.physics.add
      .sprite(100, 450, "dude")
      .setGravityY(1)
      .setDisplaySize(50, 80);
    this.player.scale = 2;
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, floor);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectSpaceRock,
      null,
      this
    );

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    cursors = this.input.keyboard.createCursorKeys();

    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.bombs, floor);
    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );
    this.physics.add.collider(this.bombs, this.spikes);
    this.physics.add.collider(this.stars, this.spikes);
    this.physics.add.collider(
      this.player,
      this.spikes,
      this.hitBomb,
      null,
      this
    );

    this.pickup = this.sound.add("pickup");
    this.end_game = this.sound.add("end_game");
    this.game_music = this.sound.add("ingame");
    this.game_music.volume = 0.1;
    this.game_music.play({ loop: true });
  }

  update() {
    if (cursors.left.isDown) {
      this.player.setVelocityX(-300);

      this.player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(300);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    if (
      (cursors.up.isDown || cursors.space.isDown) &&
      this.player.body.touching.down
    ) {
      this.player.setVelocityY(-350);
    }
    this.spotlight.x = this.player.body.position.x;
    this.spotlight.y = this.player.body.position.y;
  }

  collectSpaceRock(player, star) {
    this.pickup.play({ loop: false });
    star.disableBody(true, true);

    if (this.stars.countActive(true) == 0) {
      this.platforms.clear(true, true);
      this.spikes.clear(true, true);
      this.num_stars = 0;
      this.level = this.level + 1;

      this.loadPlatforms();
      // this.stars.children.iterate(function (child) {
      //     child.enableBody(true, child.x, 0, true, true);
      // });
      this.stars.clear(true, true);
      this.loadStars();
      var bomb_spawn_pos =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      let bomb = this.bombs.create(bomb_spawn_pos, 16, "orb1");
      bomb.scale = 0.1;
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      this.tweens.add({
        targets: bomb,
        alpha: 0,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }
  }

  hitBomb(player, bomb) {
    this.background.setPipeline("Light2D").setAlpha(1);
    let stars_children = this.stars.children.getArray();
    this.spotlight.setIntensity(0);
    stars_children.forEach((star) => {
      star.setPipeline("Light2D").setAlpha(1);
    });

    this.end_game.play({ loop: false });
    // this.game_music.stop();
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play("turn");
    this.in;
    this.gameOver = true;

    if (this.gameOver) {
      this.scene.launch("GameOver", { gameMusic: this.game_music });
    }
  }

  loadStars() {
    let starsToSpawn = Math.floor(Math.random() * (20 - 10 + 1) + 10);
    for (let i = 0; i < starsToSpawn; i++) {
      let xCord = Math.floor(Math.random() * (1200 - 20 + 1) + 20);
      let star = this.stars.create(xCord, 0, "star");

      star.setBounceY(Phaser.Math.FloatBetween(0.1, 0.15));
      star.scale = 0.12;
      star.setPipeline("Light2D");
      star.setAlpha(0.034);
    }
  }

  loadPlatforms() {
    // Ground platform
    // platforms.create(1280, 840, "ground").setScale(10).refreshBody();

    //Level: 1
    //roof spikes
    switch (this.level) {
      case 1: {
        this.spikes.create(1020, 9, "spike_down").setScale(0.5).refreshBody();
        this.spikes.create(1060, 9, "spike_down").setScale(0.5).refreshBody();
        this.spikes.create(1100, 9, "spike_down").setScale(0.5).refreshBody();
        this.spikes.create(1140, 9, "spike_down").setScale(0.5).refreshBody();
        //floor this.spikes with corresponding this.platforms
        this.spikes.create(1150, 481, "spike").setScale(0.5).refreshBody();
        this.platforms.create(1200, 500, "ground").setScale(0.75).refreshBody();
        this.platforms.create(65, 395, "ground").setScale(0.75).refreshBody();
        this.platforms.create(640, 445, "ground").setScale(0.75).refreshBody();
        this.platforms.create(240, 220, "ground").setScale(0.25).refreshBody();
        this.platforms.create(700, 150, "ground").setScale(0.25).refreshBody();
        //skinny platform right
        this.spikes.create(1134, 252, "spike_down").setScale(0.5).refreshBody();
        this.platforms.create(1100, 240, "ground").setScale(0.25).refreshBody();
        this.platforms.create(900, 350, "ground").setScale(0.25).refreshBody();
        break;
      }

      case 2: {
        //roof this.spikes
        this.spikes.create(1020, 9, "spike_down").setScale(0.5).refreshBody();
        this.spikes.create(1060, 9, "spike_down").setScale(0.5).refreshBody();
        this.spikes.create(1100, 9, "spike_down").setScale(0.5).refreshBody();
        this.spikes.create(1140, 9, "spike_down").setScale(0.5).refreshBody();
        //floor this.spikes with corresponding this.platforms
        this.platforms.create(900, 520, "ground").setScale(0.5).refreshBody();
        this.platforms.create(65, 200, "ground").setScale(0.75).refreshBody();
        this.platforms.create(480, 280, "ground").setScale(0.5).refreshBody();
        this.platforms.create(250, 475, "ground").setScale(0.5).refreshBody();
        this.spikes
          .create(10, 570, "single_spike_right")
          .setScale(0.75)
          .refreshBody();
        this.spikes
          .create(10, 610, "single_spike_right")
          .setScale(0.75)
          .refreshBody();
        this.spikes
          .create(10, 650, "single_spike_right")
          .setScale(0.75)
          .refreshBody();
        this.spikes
          .create(659, 390, "single_spike_up")
          .setScale(0.75)
          .refreshBody();
        this.spikes
          .create(660, 415, "single_spike_down")
          .setScale(0.75)
          .refreshBody();
        //skinny platform right
        this.spikes.create(1149.5, 477, "spike").setScale(0.5).refreshBody();
        this.spikes.create(1150, 495, "spike_down").setScale(0.5).refreshBody();
        this.platforms.create(1200, 160, "ground").setScale(0.5).refreshBody();
        this.platforms.create(1000, 340, "ground").setScale(0.25).refreshBody();
        break;
      }

      case 3: {
        this.spikes.create(1020, 9, "spike_down").setScale(0.5).refreshBody();
        this.spikes.create(1060, 9, "spike_down").setScale(0.5).refreshBody();
        this.spikes.create(1100, 9, "spike_down").setScale(0.5).refreshBody();
        this.spikes.create(1140, 9, "spike_down").setScale(0.5).refreshBody();
        //roof this.spikes middle
        this.spikes
          .create(610, 9, "single_spike_down")
          .setScale(0.5)
          .refreshBody();
        this.spikes.create(640, 9, "spike_down").setScale(0.5).refreshBody();
        this.spikes.create(680, 9, "spike_down").setScale(0.5).refreshBody();
        this.spikes.create(720, 9, "spike_down").setScale(0.5).refreshBody();
        this.spikes.create(760, 9, "spike_down").setScale(0.5).refreshBody();
        //floor this.spikes with corresponding this.platforms
        this.spikes.create(1150, 476, "spike").setScale(0.5).refreshBody();
        this.platforms.create(1200, 495, "ground").setScale(0.75).refreshBody();
        this.platforms.create(65, 395, "ground").setScale(0.75).refreshBody();
        this.platforms.create(640, 200, "ground").setScale(0.75).refreshBody();
        this.platforms.create(240, 220, "ground").setScale(0.25).refreshBody();
        this.platforms.create(700, 500, "ground").setScale(0.25).refreshBody();
        //skinny platform right
        this.spikes.create(1134, 252, "spike_down").setScale(0.5).refreshBody();
        this.platforms.create(1100, 240, "ground").setScale(0.25).refreshBody();
        this.platforms.create(900, 350, "ground").setScale(0.25).refreshBody();

        break;
      }

      case 4: {
        this.platforms.create(1200, 395, "ground").setScale(0.75).refreshBody();
        this.platforms.create(350, 430, "ground").setScale(0.75).refreshBody();
        this.platforms.create(80, 210, "ground").setScale(0.75).refreshBody();
        this.platforms.create(600, 180, "ground").setScale(0.5).refreshBody();
        //skinny platform right
        this.spikes.create(1070, 418, "spike_down").setScale(0.5).refreshBody();
        this.platforms.create(930, 240, "ground").setScale(0.25).refreshBody();
        this.platforms.create(900, 530, "ground").setScale(0.25).refreshBody();
        //floating this.spikes
        this.spikes.create(700, 671, "spike").setScale(0.5).refreshBody();
        this.spikes.create(699, 357, "spike").setScale(0.5).refreshBody();
        this.spikes.create(700, 375, "spike_down").setScale(0.5).refreshBody();
        break;
      }

      case 5: {
        this.platforms.create(900, 395, "ground").setScale(0.75).refreshBody();
        this.platforms.create(450, 550, "ground").setScale(0.75).refreshBody();
        this.spikes.create(9, 380, "spike_right").setScale(0.5).refreshBody();
        this.platforms.create(80, 430, "ground").setScale(0.75).refreshBody();
        this.platforms.create(450, 200, "ground").setScale(0.5).refreshBody();
        //skinny platform right
        this.platforms.create(800, 200, "ground").setScale(0.25).refreshBody();
        this.spikes.create(1271, 180, "spike_left").setScale(0.5).refreshBody();
        this.platforms.create(1200, 260, "ground").setScale(0.5).refreshBody();
        //floating this.spikes
        this.spikes.create(700, 670, "spike").setScale(0.5).refreshBody();
        this.spikes.create(899, 525, "spike").setScale(0.5).refreshBody();
        this.spikes.create(900, 543, "spike_down").setScale(0.5).refreshBody();

        break;
      }

      case 6: {
        this.platforms.create(750, 400, "ground").setScale(0.75).refreshBody();
        this.platforms.create(1200, 530, "ground").setScale(0.75).refreshBody();
        this.platforms.create(350, 330, "ground").setScale(0.75).refreshBody();
        this.spikes
          .create(10, 185, "single_spike_up")
          .setScale(0.75)
          .refreshBody();
        this.spikes
          .create(217, 235, "single_spike_down")
          .setScale(0.75)
          .refreshBody();
        this.platforms.create(80, 210, "ground").setScale(0.75).refreshBody();
        this.platforms.create(600, 190, "ground").setScale(0.5).refreshBody();
        //skinny platform right
        this.spikes.create(1271, 480, "spike_left").setScale(0.5).refreshBody();
        this.platforms.create(1050, 240, "ground").setScale(0.25).refreshBody();
        this.platforms.create(400, 530, "ground").setScale(0.5).refreshBody();
        //floating this.spikes
        this.spikes.create(700, 671, "spike").setScale(0.5).refreshBody();
        this.spikes.create(740, 671, "spike").setScale(0.5).refreshBody();
        this.spikes.create(780, 671, "spike").setScale(0.5).refreshBody();
        this.spikes.create(820, 671, "spike").setScale(0.5).refreshBody();
        this.spikes.create(989, 327, "spike").setScale(0.5).refreshBody();
        this.spikes.create(990, 345, "spike_down").setScale(0.5).refreshBody();

        break;
      }

      case 7: {
        this.platforms.create(750, 440, "ground").setScale(0.75).refreshBody();
        this.platforms.create(1200, 530, "ground").setScale(0.75).refreshBody();
        this.platforms.create(350, 120, "ground").setScale(0.75).refreshBody();
        this.spikes
          .create(15, 440, "single_spike_up")
          .setScale(1)
          .refreshBody();
        this.spikes
          .create(214, 145, "single_spike_down")
          .setScale(0.75)
          .refreshBody();
        this.platforms.create(80, 470, "ground").setScale(0.75).refreshBody();
        this.platforms.create(600, 250, "ground").setScale(0.5).refreshBody();
        //skinny platform right
        this.spikes.create(1271, 480, "spike_left").setScale(0.5).refreshBody();
        this.platforms.create(1150, 250, "ground").setScale(0.5).refreshBody();
        this.platforms.create(400, 600, "ground").setScale(0.5).refreshBody();
        //floating this.spikes
        this.spikes.create(700, 671, "spike").setScale(0.5).refreshBody();
        this.spikes.create(740, 671, "spike").setScale(0.5).refreshBody();
        this.spikes.create(780, 671, "spike").setScale(0.5).refreshBody();
        this.spikes.create(820, 671, "spike").setScale(0.5).refreshBody();
        this.spikes.create(829, 190, "spike").setScale(0.5).refreshBody();
        this.spikes.create(830, 208, "spike_down").setScale(0.5).refreshBody();
        break;
      }

      case 8: {
        this.spikes.create(580, 9, "spike_down").setScale(0.5).refreshBody();
        this.spikes.create(620, 9, "spike_down").setScale(0.5).refreshBody();
        this.spikes.create(660, 9, "spike_down").setScale(0.5).refreshBody();
        this.spikes.create(700, 9, "spike_down").setScale(0.5).refreshBody();
        //floor this.spikes with corresponding this.platforms
        this.platforms.create(750, 500, "ground").setScale(0.75).refreshBody();
        this.platforms.create(1200, 530, "ground").setScale(0.75).refreshBody();
        // this.platforms.create(350, 330, "ground").setScale(0.75).refreshBody();
        this.spikes
          .create(242, 209, "single_spike_right")
          .setScale(0.65)
          .refreshBody();
        this.spikes
          .create(217, 235, "single_spike_down")
          .setScale(0.75)
          .refreshBody();
        this.platforms.create(80, 210, "ground").setScale(0.75).refreshBody();
        this.platforms.create(600, 190, "ground").setScale(0.5).refreshBody();
        //skinny platform right
        this.spikes.create(1271, 480, "spike_left").setScale(0.5).refreshBody();
        this.platforms.create(1120, 350, "ground").setScale(0.5).refreshBody();
        this.platforms.create(300, 530, "ground").setScale(0.5).refreshBody();
        //floating this.spikes
        this.spikes.create(740, 671, "spike").setScale(0.5).refreshBody();
        this.spikes.create(799, 282, "spike").setScale(0.5).refreshBody();
        this.spikes.create(800, 300, "spike_down").setScale(0.5).refreshBody();
        break;
      }
    }

    //Level: 2

    //Level: 3
    // //roof spikes

    //Level: 4
    // //floor spikes with corresponding platforms

    //Level: 5
    // //floor spikes with corresponding platforms

    //Level: 6
    // //floor spikes with corresponding platforms

    //Level: 7
    // //floor spikes with corresponding platforms

    //Level: 8
    // // roof spikes
  }
}
