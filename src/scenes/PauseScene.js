import Phaser from '../lib/phaser.js'

export default class PauseScene extends Phaser.Scene {
 
    constructor ()
    {
        super('PauseScene');
    }

     preload ()
    {

      this.load.image('resume_button', 'assets/resume.png'); 

    
    }

    create ()
    {

      let resume_button = this.add.sprite(20,20, 'resume_button').setInteractive({ useHandCursor: true })
      resume_button.scale=0.2  
      resume_button.on('pointerdown',  () => {
  
          this.scene.resume('Game');
        this.scene.stop();
      });
  
      
    //  this.resume = this.add
    // .text(40, 10, "Resume", {
    //   fontSize: "20px",
    //   fontFamily: "Galactic",
    // })
    // .setOrigin(0.5)
    // .setStroke("navy", 22)
    // .setShadow(2, 2, "#333333", 5, true, true)
    // .setInteractive({ useHandCursor: true })


    // this.resume.on("pointerup", () => {
    //     this.scene.resume('Game');
    //     this.scene.stop();
        
    //   })  

    }
    

    update() {

       

    }

}
