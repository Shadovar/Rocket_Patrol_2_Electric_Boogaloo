class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {
        //Initialize number of players
        this.numPlayers = 1;

        //Initialize score text
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //Show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        console.log("Center X:" + centerX + ", Center Y:" + centerY);
        this.add.text(centerX, centerY-(2*textSpacer), 'ROCKET PATROL', menuConfig).setOrigin(0.5);

        //Text boxes that vary based on number of players
        this.numPlayersText = this.add.text(centerX, centerY-textSpacer, '1↑ Player', menuConfig).setOrigin(0.5);
        this.p1Controls = this.add.text(centerX, centerY, 'Use ←→ arrows to move & (F) to Fire', menuConfig).setOrigin(0.5);
        this.p2Controls = this.add.text(centerX, centerY+textSpacer, '', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.startText = this.add.text(centerX, centerY+(2*textSpacer), 'Press ← for Easy and → for Hard', menuConfig).setOrigin(0.5);

        //Define keyboard inputs
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        console.log(this);
    }

    update() {
        if(this.numPlayers == 1){
          if(Phaser.Input.Keyboard.JustDown(keyUP)){
            //Increase number of players
            this.numPlayers = 2;
            this.increasePlayers();
            this.sound.play('sfx_select');
          }
          if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
              spaceshipSpeed: 3,
              gameTimer: 60000,
              numPlayers: 1    
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");    
          }
          if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
              spaceshipSpeed: 4,
              gameTimer: 45000,
              numPlayers: 1    
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");    
          }
        }
        //Two Player Menu Controls
        else{
          if(Phaser.Input.Keyboard.JustDown(keyDOWN)){
            //Decrease number of players
            this.numPlayers = 1;
            this.decreasePlayers();
            this.sound.play('sfx_select');
          }
          if(Phaser.Input.Keyboard.JustDown(keyRIGHT)){
            //Start 2 player mode
            game.settings = {
              spaceshipSpeed: 3,
              gameTimer: 60000,
              numPlayers: 2
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene"); 
          }
        }
    }

    increasePlayers(){
      //Update screen for 2 player menu
      this.numPlayersText.text = '2↓ Players';
      this.p1Controls.text = 'P1: (D) and (G) to move & (F) to Fire';
      this.p2Controls.text = 'P2: ↑/↓ to change ship, ←/→ for speed';
      this.startText.text = 'Press → to Start';

    }

    decreasePlayers(){
      //Update screen for 1 player menu
      this.numPlayersText.text = '1↑ Player';
      this.p1Controls.text = 'Use ←→ arrows to move & (F) to Fire';
      this.p2Controls.text = '';
      this.startText.text = 'Press ← for Easy and → for Hard';
    }
}