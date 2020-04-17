class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }

    preload() {
        //Load images and tile sprite
        this.load.image('rocket', "./assets/rocket.png");
        this.load.image('spaceship',"./assets/spaceship.png");
        this.load.image('starfield',"./assets/starfield.png");

        //Add explosion
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        //Display scene text
        console.log(this);
        this.add.text(20,20,"Rocket Patrol Play");

        //Place tile sprite
        this.starfield = this.add.tileSprite(0,0,640,480,'starfield').setOrigin(0,0);
        console.log(this.starfield);

        //Create white rectangle border
        //SetOrigin is relative to object, not scene
        this.add.rectangle(5,5,630,32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5,443,630,32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5,5,32,455, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(603,5,32,455, 0xFFFFFF).setOrigin(0,0);

        //Create Green UI background
        this.add.rectangle(37,42,566,64, 0x00FF00).setOrigin(0,0);

        //Add rocket player one
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'rocket').setScale(0.5,0.5).setOrigin(0,0);

        //Add starships
        this.ship01 = new Starship(this, game.config.width + 192, 132, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Starship(this, game.config.width + 96, 196, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Starship(this, game.config.width, 260, 'spaceship', 0, 10).setOrigin(0,0);

        //Define keyboard inputs
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //Add animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        //Instantiate score
        this.p1Score = 0;

        //Game Over flag
        this.gameOver = false;

        //Initialize score text
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {

        // check key input for restart
        if(this.gameOver){
            if(Phaser.Input.Keyboard.JustDown(keyF)){ //Restart
                this.scene.restart(this.p1Score);
            } else if (Phaser.Input.Keyboard.JustDown(keyLEFT)){ //Return to menu
                this.scene.start("menuScene"); 
            }
        }

        //scroll starfield
        this.starfield.tilePositionX -= 3.5;
        this.starfield.tilePositionY += 1.25;

        //only update player/enemies if game is not over
        if(!this.gameOver){
            //Update rocket
            this.p1Rocket.update();

            //Update starships
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        //Check for rocket-starship collisions
        if(this.checkCollision(this.p1Rocket, this.ship01)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
    }

    //Determines if a rocket and starship have collided
    checkCollision(rocket, ship)
    {
            // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y){

            return true;
        } else {
            return false;
        }
    }

    //Handles the explosion of a ship
    shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        this.sound.play('sfx_explosion');
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });

        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;       
    }
}