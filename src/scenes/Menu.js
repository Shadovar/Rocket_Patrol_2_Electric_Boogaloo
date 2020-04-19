class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');

        // load images
        this.load.image('titlecard', './assets/TitleCard.png');
    }

    create() {
        //Initialize number of players
        this.numPlayers = 1;

        //Create background
        this.add.rectangle(0, 0, game.config.width, game.config.height, '0x358CA6').setOrigin(0,0);

        //Initialize score text
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '12px',
            backgroundColor: '#000000',
            color: '#FFFFFF',
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
        let textSpacer = 50;

        //Initialize titlecard image
        this.title = this.add.image(centerX, centerY, 'titlecard').setOrigin(0.53,0.9);

        //Subtitle
        this.subtitle = this.add.text(centerX, centerY+(0.5*textSpacer), 'Did you know that Orcas are one of the only natural predators of moose?', menuConfig).setOrigin(0.5);
        //Change config for rest of menu
        menuConfig.fontSize = '20px';
        menuConfig.color = '#244717';
        menuConfig.backgroundColor = '#ef7827';

        //Text boxes that vary based on number of players
        this.playerCountText = this.add.text(centerX, centerY+textSpacer, '----Single Player----', menuConfig).setOrigin(0.5);
        this.p1Controls = this.add.text(centerX, centerY+(1.75*textSpacer), 'Use ←→ arrows to move & (S) to Swim', menuConfig).setOrigin(0.5);
        this.p2Controls = this.add.text(centerX, centerY+(2.5*textSpacer), '', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.startText = this.add.text(centerX, centerY+(3.25*textSpacer), 'Press ← for Easy and → for Hard', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '16px';
        menuConfig.color = '#244717';
        menuConfig.backgroundColor = '#ef7827';
        this.numPlayersText = this.add.text(centerX, centerY+(4*textSpacer), 'Press ↑ for 2 Players', menuConfig).setOrigin(0.5);

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
      this.playerCountText.text = '------2 Players------';
      this.numPlayersText.text = 'Press ↓ for 1 Player';
      this.p1Controls.text = 'Predator: (A) and (D) to move ←/→ & (S) to Swim';
      this.p2Controls.text = 'Prey: ↑/↓ to change moose, ←/→ for speed';
      this.startText.text = 'Press → to Start';

    }

    decreasePlayers(){
      //Update screen for 1 player menu
      this.playerCountText.text = '----Single Player----';
      this.numPlayersText.text = 'Press ↑ for 2 Players';
      this.p1Controls.text = 'Use ←→ arrows to move & (S) to Swim';
      this.p2Controls.text = '';
      this.startText.text = 'Press ← for Easy and → for Hard';
    }
}