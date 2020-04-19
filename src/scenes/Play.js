class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }

    preload() {
        //Load images and tile sprite
        this.load.image('rocket', "./assets/orcaFin.png");
        this.load.image('spaceship',"./assets/moose.png");
        this.load.image('starfield',"./assets/ocean.png");

        //Add explosion
        this.load.spritesheet('explosion', './assets/eatMooseSheet.png', {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 17});
    }

    create() {
        //Display scene text
        console.log(this);
        this.add.text(20,20,"Moose Hunter Play");

        //Place tile sprite
        this.starfield = this.add.tileSprite(0,0,640,480,'starfield').setOrigin(0,0);
        console.log(this.starfield);

        //Add rocket player one
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'rocket').setScale(0.5,0.5).setOrigin(0,0);

        //Add starships
        this.ship03 = new Starship(this, game.config.width + 192, 132, 'spaceship', 0, 30, 3).setOrigin(0,0);
        this.ship02 = new Starship(this, game.config.width + 96, 196, 'spaceship', 0, 20, 2).setOrigin(0,0);
        this.ship01 = new Starship(this, game.config.width, 260, 'spaceship', 0, 10, 1).setOrigin(0,0);
        //Instantiate tracker of p2's selected ship
        this.p2Ship = {
            num: 0,
            ship: this.ship01
        };
        if(game.settings.numPlayers == 2){
            //In a 2 player game, set the selected ship to be the lowest one 
            this.ship01.toggleSelected();
            this.ship01.setTint('0x885200');
            this.p2Ship.num = 1; //Only register it as the selected ship if there is a 2nd player
        }

        
        //Create white rectangle border
        //SetOrigin is relative to object, not scene
        this.add.rectangle(5,5,630,32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5,443,630,32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5,5,32,455, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(603,5,32,455, 0xFFFFFF).setOrigin(0,0);

        //Create Green UI background
        this.add.rectangle(37,42,566,64, 0x00FF00).setOrigin(0,0);

        //Define keyboard inputs
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        //Add animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 17, first: 0}),
            frameRate: 18
        });

        //Instantiate score
        this.p1Score = 0;
        this.p2Score = 0;

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
        this.scoreRight = this.add.text(471, 54, this.p2Score, scoreConfig);
        if(game.settings.numPlayers == 1){
            //Make p2 score invisible if there is only 1 player
            this.scoreRight.text = '';
            this.scoreRight.alpha = 0;
            console.log("Play.js:: game.settings.numPlayers = ");
            console.log(game.settings.numPlayers);
        }

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            //Add text based on who won
            if(game.settings.numPlayers == 1){
                this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            }
            else if(this.p1Score > this.p2Score){
                this.add.text(game.config.width/2, game.config.height/2, 'Player 1 Wins', scoreConfig).setOrigin(0.5);
            }
            else if(this.p1Score < this.p2Score){
                this.add.text(game.config.width/2, game.config.height/2, 'Player 2 Wins', scoreConfig).setOrigin(0.5);
            }
            else{
                this.add.text(game.config.width/2, game.config.height/2, 'Entropy Wins', scoreConfig).setOrigin(0.5);
            }
            //Add remaining text
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
        this.starfield.tilePositionX += 3.5;
        this.starfield.tilePositionY -= 1;

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

        //Check if a starship has crossed the screen
        this.checkEdge(this.ship01);
        this.checkEdge(this.ship02);
        this.checkEdge(this.ship03);

        //In a two player game, check if p2 is changing ship
        if(game.settings.numPlayers == 2){
            if(Phaser.Input.Keyboard.JustDown(keyUP)){
                this.updateSelected(1); //Increment selected ship
            }
            if(Phaser.Input.Keyboard.JustDown(keyDOWN)){
                this.updateSelected(-1); //Decrement selected ship
            }
            //Update the border's position
            //this.p2Border.x = this.p2Ship.ship.x;
            //this.p2Border.y = this.p2Ship.ship.y;
        }
    }

    //Determines if a rocket and starship have collided
    checkCollision(rocket, ship)
    {
            // simple AABB checking
        if (rocket.x < (ship.x + ship.width - 20) && 
            rocket.x + rocket.width > (ship.x + 20) && 
            rocket.y < (ship.y + ship.height - 20) &&
            (rocket.height + rocket.y - 5) > (ship. y + 20)){

            return true;
        } else {
            return false;
        }
    }

    //Handles the explosion of a ship
    shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        this.p1Rocket.alpha = 0;
        this.sound.play('sfx_explosion');
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            this.p1Rocket.alpha = 1;
            boom.destroy();                     // remove explosion sprite
        });

        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;       
    }


    //Determines if a starship has reached the side of the screen
    checkEdge(ship)
    {
        if(ship.x <= (0-ship.width)){
            ship.reset();
            if(game.settings.numPlayers == 2){
                this.p2Score += ship.p2Points;
                if(ship.id == this.p2Ship.num){ //The ship scores double if it is currently selected
                    this.p2Score += ship.p2Points;
                }
                this.scoreRight.text = Math.floor(this.p2Score);
            }
        }
    }

    //Updates p2's currently selected ship
    updateSelected(incr){
        //Toggle the current selected ship
        this.p2Ship.ship.toggleSelected();
        this.p2Ship.ship.setTint('0xFFFFFF');

        //Track the correct number
        this.p2Ship.num += incr;
        if(this.p2Ship.num <= 0){
            this.p2Ship.num = 3;
        }
        else if(this.p2Ship.num > 3){
            this.p2Ship.num = 1;
        }

        //Reference the correct ship
        if(this.p2Ship.num == 1){
            this.p2Ship.ship = this.ship01;
        }
        else if(this.p2Ship.num == 2){
            this.p2Ship.ship = this.ship02;
        }
        else if(this.p2Ship.num == 3){
            this.p2Ship.ship = this.ship03;
        }
        else{
            console.log('Play.js::updateSelected: invalid ship number for p2 ship');
        }

        //Toggle the newly selected ship
        this.p2Ship.ship.toggleSelected();
        this.p2Ship.ship.setTint('0x885200');
    }
}