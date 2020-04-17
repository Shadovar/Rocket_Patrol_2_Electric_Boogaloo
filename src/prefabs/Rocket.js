//Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture , frame)
    {
        super(scene, x, y, texture, frame);

        //Add object to the existing scene, displayList, updateList
        scene.add.existing(this);

        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }

    update()
    {
        //Horizontal movement
        if(!this.isFiring){
            if(keyLEFT.isDown && this.x >= 47){
                this.x -= 2;
            }
            if(keyRIGHT.isDown && this.x <= game.config.width-62){
                this.x += 2;
            }
        }

        //Firing
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring){
            this.isFiring = true;
            this.sfxRocket.play();
        }

        //Vertical movement
        if(this.isFiring){
            if(this.y >= 109){
                this.y -= 2;
            }
            //reset on miss
            else {
                this.reset();
            }
        }
    }

    reset()
    {
        this.isFiring = false;
        this.y = 431;
    }
}