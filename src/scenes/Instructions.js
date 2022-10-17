
import Phaser from '../lib/phaser.js'
import {preload,addLaser} from '../lib/laser.js'


export default class Instructions extends Phaser.Scene {

    constructor ()
    {
        super('Instructions');
    }

     preload ()
    {
        this.load.image('instructions_background','assets/instructions_background.jpg');
        this.load.image('instructions_textbox','assets/instructions_keys.png');
        this.load.image("collect_stars", "assets/collect_this_star.png");
        this.load.image("avoid_bomb", "assets/avoid_this_bomb.png");

        // this.load.plugin({key:'PathBuilder.min', url:"src/lib/PathBuilder.min.js",mapping:'PathBuilder'});
        // load laser paths
        preload(this,[
            {
                path_key:'top_triangle_path',
                path:'assets/paths/top_triangle_path.json'
            },
            {
                path_key:'top_corner_path',
                path:'assets/paths/top_corner_path.json'
            },
            {
                path_key:'bottom_blue_line_path',
                path:'assets/paths/bottom_blue_line_path.json'
            },
            {
                path_key:'bottom_line_1_path',
                path:'assets/paths/bottom_line_1_path.json'
            },
            {
                path_key:'bottom_line_red_path',
                path:'assets/paths/bottom_line_red_path.json'
            },
            {
                path_key:'bottom_rectangle_blue_path',
                path:'assets/paths/bottom_rectangle_blue_path.json'
            },
            {
                path_key:'bottom_rectangle_green_path',
                path:'assets/paths/bottom_rectangle_green_path.json'
            },
            {
                path_key:'top_line_blue_path',
                path:'assets/paths/top_line_blue_path.json'
            },
            {
                path_key:'bottom_yellow_line_path',
                path:'assets/paths/bottom_yellow_line_path.json'
            }
        ])
    }

 create ()
{




    let background = this.add.sprite(1280/2,720/2, 'instructions_background');
    background.setDisplaySize(1280,820)  

    let textbox = this.add.sprite(1280/2, 720/3, 'instructions_textbox');
    textbox.scale = 1.5


    let star = this.add.sprite(294,495,'collect_stars')
    
 
    let bomb = this.add.sprite(934,108,'avoid_bomb')
    bomb.scale=0.5
        const content = "Find your way through the darkness\n of space using the arrow keys (press up to jump), \n collect as many stars as you can, becareful,\n danger may be lurking"




    // add laser
    addLaser(this,{
        path_key: 'top_triangle_path',
        colours: ['red'],
        start: 0.1,
        end: 0.1,
        quantity: 48,
        yoyo: false,
        particle_key: 'flares'
    })

    addLaser(this,{
        path_key: 'top_corner_path',
        colours: ['red'],
        start: 0.1,
        end: 0.1,
        quantity: 48,
        yoyo: false,
        particle_key: 'flares'
    })

    addLaser(this,{
        path_key: 'bottom_blue_line_path',
        colours: ['blue'],
        start: 0.1,
        end: 0.1,
        quantity: 48,
        yoyo: true,
        particle_key: 'flares'
    })

    addLaser(this,{
        path_key: 'bottom_line_1_path',
        colours: ['blue'],
        start: 0.1,
        end: 0.1,
        quantity: 100,
        yoyo: false,
        particle_key: 'flares'
    })

    addLaser(this,{
        path_key: 'bottom_line_red_path',
        colours: ['red'],
        start: 0.1,
        end: 0.1,
        quantity: 100,
        yoyo: false,
        particle_key: 'flares'
    })

    addLaser(this,{
        path_key: 'bottom_rectangle_blue_path',
        colours: ['blue'],
        start: 0.1,
        end: 0.1,
        quantity: 100,
        yoyo: false,
        particle_key: 'flares'
    })

    addLaser(this,{
        path_key: 'bottom_rectangle_green_path',
        colours: ['green'],
        start: 0.1,
        end: 0.1,
        quantity: 48,
        yoyo: false,
        particle_key: 'flares'
    })


    addLaser(this,{
        path_key: 'top_line_blue_path',
        colours: ['blue'],
        start: 0.1,
        end: 0.1,
        quantity: 48,
        yoyo: false,
        particle_key: 'flares'
    })

    
    addLaser(this,{
        path_key: 'bottom_yellow_line_path',
        colours: ['yellow'],
        start: 0.1,
        end: 0.1,
        quantity: 10,
        yoyo: false,
        particle_key: 'flares'
    })

    this.dust.addOnePixelDust({ count: 200, alpha: 3 , tint: 0xA3CB38 });

    const landingButton = this.add
    .text(800, 600, "Back", {
      fontSize: "50px",
      fontFamily: "Galactic",
    })
    .setOrigin(0.5)
    .setStroke("navy", 22)
    .setShadow(2, 2, "#333333", 5, true, true)
    .setInteractive({ useHandCursor: true })

    landingButton.on("pointerup", () => {
      this.scene.start('landing')
    })

}

update() {



    
}
 
}
