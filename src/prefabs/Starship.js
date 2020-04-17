//Starship prefab
class Starship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, ID){
        super(scene, x, y, texture, frame);

        //Add object to the existing scene, displayList, updateList
        scene.add.existing(this);

        //Instantiate vars
        this.points = pointValue;
        this.p2Points = (40 - pointValue)/3; //Invert the score, make it increments of 5 instead of 10
        this.id = ID;

        //Whether it is currently being controlled
        this.controlled = false;
    }

    update()
    {
        //Horizontal movement
        this.x -= game.settings.spaceshipSpeed;
        //Additional movement based on control
        if(this.controlled){
            if(keyLEFT.isDown){
                this.x -= 1;
            }
            if(keyRIGHT.isDown){
                this.x += 1;
            }
        }
    }

    reset(){
        this.x = game.config.width;
    }

    toggleSelected(){
        this.controlled = !this.controlled;
    }
}