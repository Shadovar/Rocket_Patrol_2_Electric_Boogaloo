/*Name: Carl Erez
    Altice
    CMPM 120
    4-19-20

    Point Breakdown:
        50: Simultaneous Local Multiplayer
        25: New artwork for all assets (rocket-> orca, starship-> moose, explosion-> orca eating moose)
        15: Create new title screen (recolored and organized text, and that logo was quite annoying to make read properly)
                (Perhaps only worth 10, given that I generally kept the text box formatting)
        10: Create new scrolling tile sprite for the background (stars-> ocean with small chunks of ice)
        10: Allow the player to control the rocket after it is fired
*/

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
let keyS, keyA, keyD, keyUP, keyDOWN, keyLEFT, keyRIGHT;