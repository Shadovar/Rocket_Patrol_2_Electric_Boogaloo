let config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
};

let game = new Phaser.Game(config);

// define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000,
    numPlayers: 1    
}

//reserve some keyboard variables
let keyF, keyG, keyD, keyUP, keyDOWN, keyLEFT, keyRIGHT;