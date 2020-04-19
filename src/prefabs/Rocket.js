//Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame)
    {
        super(scene, x, y, texture, frame);

        //Add object to the existing scene, displayList, updateList
        scene.add.existing(this);

        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx

        //Set the default horizontal speed to 2 pixels/frame
        this.horizontalSpeed = 2;
    }

    update()
    {
        //Horizontal movement
        //Single player horizontal inputs
        if(game.settings.numPlayers == 1){
            if(keyLEFT.isDown && this.x >= 47){
                this.x -= this.horizontalSpeed;
            }
            if(keyRIGHT.isDown && this.x <= game.config.width-62){
                this.x += this.horizontalSpeed;
            }
        }
        //Two player horizontal inputs
        else{
            if(keyD.isDown && this.x >= 47){
                this.x -= this.horizontalSpeed;
            }
            if(keyG.isDown && this.x <= game.config.width-62){
                this.x += this.horizontalSpeed;
            }   
        }

        //Firing
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring){
            this.isFiring = true;
            this.horizontalSpeed = 1;
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
        this.horizontalSpeed = 2;
    }
}