// PixiJS Game Canvas

// Variable declaration for different scenes

let app, matchScene, lobbyScene, selectScene, gameScene, victoryScene, unlockScene;

let matchText = new PIXI.Text("MATCHMAKING");
const create = PIXI.Sprite.from('../img/create-button.png');
const join = PIXI.Sprite.from('../img/join-button.png');
const lobby = PIXI.Sprite.from('../img/lobby-logo.png');
let readyText = new PIXI.Text("THROW A PUNCH WHEN YOU'RE READY!");
const punch = PIXI.Sprite.from('../img/punch-button.png');
let playerText = new PIXI.Text("Waiting for you...");
let opponentText = new PIXI.Text("Waiting for your opponent...");
let selectText = new PIXI.Text("CHOOSE YOUR FIGHTER");
const selectBezos = PIXI.Sprite.from('../img/select-bezos.png');
const selectMusk = PIXI.Sprite.from('../img/select-musk.png');
const selectZuck = PIXI.Sprite.from('../img/select-zuck.png');
const selectCook = PIXI.Sprite.from('../img/select-cook.png');
let atk1 = PIXI.Sprite.from('../img/atk1.png');
let atk2 = PIXI.Sprite.from('../img/atk2.png');
let atk3 = PIXI.Sprite.from('../img/atk3.png');
let atk4 = PIXI.Sprite.from('../img/atk4.png');
let player1hp = new PIXI.Text("100");
let player2hp = new PIXI.Text("100");
let victoryText = new PIXI.Text("WINNER IS...");
let unlockText = new PIXI.Text("YOU'VE UNLOCKED A NEW FIGHTER!");
let spriteBezos = PIXI.Sprite.from('../img/sprite-bezos.png');
let spriteMusk = PIXI.Sprite.from('../img/sprite-musk.png');
let spriteZuck = PIXI.Sprite.from('../img/sprite-zuck.png');
let spriteCook = PIXI.Sprite.from('../img/sprite-cook.png');

// Initial load in function

const init = function() {
    app = new PIXI.Application({
        backgroundColor: 0xffffff,
    });

    document.querySelector(".content-ctr").appendChild(app.view);

    matchScene = new PIXI.Container();
    lobbyScene = new PIXI.Container();
    selectScene = new PIXI.Container();
    gameScene = new PIXI.Container();
    victoryScene = new PIXI.Container();
    unlockScene = new PIXI.Container();

    //testing purposes: victory scene true
    matchScene.visible = true;
    lobbyScene.visible = false;
    selectScene.visible = false;
    gameScene.visible = false;
    victoryScene.visible = false;
    unlockScene.visible = false;

    window.addEventListener('resize', resize);

    function resize() {
        const parent = app.view.parentNode;

        app.renderer.resize(parent.clientWidth, parent.clientHeight);

        matchScene.position.set(app.screen.width / 2, app.screen.height / 2);
        app.stage.addChild(matchScene);
        lobbyScene.position.set(app.screen.width / 2, app.screen.height / 2);
        app.stage.addChild(lobbyScene);
        selectScene.position.set(app.screen.width / 2, app.screen.height / 2);
        app.stage.addChild(selectScene);
        gameScene.position.set(app.screen.width / 2, app.screen.height / 2);
        app.stage.addChild(gameScene);
        victoryScene.position.set(app.screen.width / 2, app.screen.height / 2);
        app.stage.addChild(victoryScene);
        unlockScene.position.set(app.screen.width / 2, app.screen.height / 2);
        app.stage.addChild(unlockScene);
    }

    resize();
    matchSetup();
}

// Match scene setup function

const matchSetup = function() {
    matchText.anchor.set(0.5);
    matchText.y = -240;
    matchText.style = new PIXI.TextStyle(({
        fill: 0x158233,
        fontSize: 60,
        fontFamily: 'Press Start 2P',
    }));

    matchText.style.stroke = 0x000000;
    matchText.style.strokeThickness = 7;

    create.scale.set(1.4);
    create.anchor.set(0.5);
    create.y = -80;

    join.scale.set(1.4);
    join.anchor.set(0.5);
    join.y = 60;

    create.interactive = true;
    create.buttonMode = true;
    join.interactive = true;
    join.buttonMode = true;

    matchScene.addChild(create);
    matchScene.addChild(join);
    matchScene.addChild(matchText);

    let input = new PIXI.TextInput({
        input: {
            fontFamily: 'Press Start 2P',
            fontSize: '25px',
            padding: '15px',
            width: '410px',
            color: '#000',
        },
        box: {
            default: {fill: 0xD1DDEB, rounded: 10, stroke: {color: 0x849AB4, width: 3}},
            focused: {fill: 0xD1DDEB, rounded: 10, stroke: {color: 0x849AB4, width: 3}},
            disabled: {fill: 0xD1DDEB, rounded: 10}
        }
    })

    input.placeholder = 'Enter room code';
    input.y = 190;
    input.pivot.x = input.width / 2;
    input.pivot.y = input.height / 2;
    matchScene.addChild(input);

    /*join.on('pointerdown', (e) => {
        matchScene.visible = false;
        lobbyScene.visible = true;
        lobbySetup();
    });*/
}

// Lobby scene setup function

const lobbySetup = function() {
    lobbyScene.addChild(lobby);
    lobby.scale.set(0.9);
    lobby.anchor.set(0.5);
    lobby.y = -270;

    readyText.anchor.set(0.5);
    readyText.y = -70;
    readyText.style = new PIXI.TextStyle(({
        fill: 0x4F6F9E,
        fontSize: 40,
        fontFamily: 'Press Start 2P',
        fontStyle: 'bold',
    }));

    readyText.style.stroke = 0x000000;
    readyText.style.strokeThickness = 6;

    playerText.anchor.set(0.5);
    playerText.y = 270;
    playerText.style = new PIXI.TextStyle(({
        fill: 0x6F1515,
        fontSize: 35,
        fontFamily: 'Press Start 2P',
    }));

    opponentText.anchor.set(0.5);
    opponentText.y = 340;
    opponentText.style = new PIXI.TextStyle(({
        fill: 0x6F1515,
        fontSize: 35,
        fontFamily: 'Press Start 2P',
    }));

    lobbyScene.addChild(readyText);
    lobbyScene.addChild(playerText);
    lobbyScene.addChild(opponentText);

    lobbyScene.addChild(punch);
    punch.scale.set(1.3);
    punch.anchor.set(0.5);
    punch.y = 100;

    punch.interactive = true;
    punch.buttonMode = true;
}

// Select scene setup function

const selectSetup = function() {
    selectText.anchor.set(0.5);
    selectText.y = -300;
    selectText.style = new PIXI.TextStyle(({
        fill: 0x4F6F9E,
        fontSize: 40,
        fontFamily: 'Press Start 2P',
        fontStyle: 'bold',
    }));

    selectText.style.stroke = 0x000000;
    selectText.style.strokeThickness = 6;

    selectScene.addChild(selectText);

    selectBezos.anchor.set(0.5);
    selectBezos.y = 60;
    selectBezos.x = -450;

    selectMusk.anchor.set(0.5);
    selectMusk.y = 60;
    selectMusk.x = -150;

    selectZuck.anchor.set(0.5);
    selectZuck.y = 60;
    selectZuck.x = 150;

    selectCook.anchor.set(0.5);
    selectCook.y = 60;
    selectCook.x = 450;

    selectBezos.interactive = true;
    selectBezos.buttonMode = true;

    selectMusk.interactive = true;
    selectMusk.buttonMode = true;

    selectZuck.interactive = true;
    selectZuck.buttonMode = true;

    selectCook.interactive = true;
    selectCook.buttonMode = true;

    selectScene.addChild(selectBezos);
    selectScene.addChild(selectMusk);
    selectScene.addChild(selectZuck);
    selectScene.addChild(selectCook);
}

// Game scene setup function

const gameSetup = function() {
    atk1.y = 300;
    atk1.x = -450;
    atk1.anchor.set(0.5);

    atk2.y = 300;
    atk2.x = -150;
    atk2.anchor.set(0.5);

    atk3.y = 300;
    atk3.x = 150;
    atk3.anchor.set(0.5);

    atk4.y = 300;
    atk4.x = 450;
    atk4.anchor.set(0.5);

    player1hp.y = 100;
    player1hp.x = -450;
    player1hp.anchor.set(0.5);

    player2hp.y = 100;
    player2hp.x = 450;
    player2hp.anchor.set(0.5);

    gameScene.addChild(atk1);
    gameScene.addChild(atk2);
    gameScene.addChild(atk3);
    gameScene.addChild(atk4);
    gameScene.addChild(player1hp);
    gameScene.addChild(player2hp);

    atk1.interactive = true;
    atk1.buttonMode = true;

    atk2.interactive = true;
    atk2.buttonMode = true;

    atk3.interactive = true;
    atk3.buttonMode = true;

    atk4.interactive = true;
    atk4.buttonMode = true;
}

// Victory scene setup function

const victorySetup = function (winner) {
    let winnerText = new PIXI.Text(winner);

    victoryText.anchor.set(0.5);
    winnerText.anchor.set(0.5);
    victoryText.y = -300;
    winnerText.y = 300;
    victoryText.style = new PIXI.TextStyle(({
        fill: 0x158233,
        fontSize: 40,
        fontFamily: 'Press Start 2P',
        fontStyle: 'bold',
    }));

    winnerText.style = new PIXI.TextStyle(({
        fill: 0x158233,
        fontSize: 40,
        fontFamily: 'Press Start 2P',
        fontStyle: 'bold',
    }));

    victoryText.style.stroke = 0x000000;
    victoryText.style.strokeThickness = 6;
    winnerText.style.stroke = 0x000000;
    winnerText.style.strokeThickness = 6;

    victoryScene.addChild(victoryText);
    victoryScene.addChild(winnerText);

    victoryText.interactive = true;
    victoryText.buttonMode = true;

    // Conditional for if the player unlocks a new character.. Placeholder for now to go to next scene
    victoryText.on('pointerdown', (event) => {
        victoryScene.visible = false;
        unlockScene.visible = true;
        unlockSetup();
    });
}

// Unlock scene setup function

const unlockSetup = function () {
    unlockText.anchor.set(0.5);
    unlockText.y = -300;
    unlockText.style = new PIXI.TextStyle(({
        fill: 0x158233,
        fontSize: 40,
        fontFamily: 'Press Start 2P',
        fontStyle: 'bold',
    }));

    unlockText.style.stroke = 0x000000;
    unlockText.style.strokeThickness = 6;

    unlockScene.addChild(unlockText);
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

window.onload = function() {

    init();

    // Socket code

    let currentRoom = 100000; // default value for no joined room = 100000

    const socket = io();

    // SOCKET - INCOMING MESSAGES FROM SERVER
    socket.on("connect", () => {
        console.log(socket.id);
        console.log("Username: " + getCookie("username"));
        socket.emit("TX_USERNAME", getCookie("username"));
        socket.emit("VICTORY_CONTINUE"); //move to victoryText after it is fully implemented
    });

    socket.on("successful_join", (response) => {
        console.log(response.msg);
        currentRoom = response.room;
        console.log("Stored Room ID: " + currentRoom);
        matchScene.visible = false;
        lobbyScene.visible = true;
        lobbySetup();
    });

    socket.on("failed_join", (response) => {
        console.log(response.msg);
    });

    socket.on("players_ready", (response) => {
        console.log(response.msg);
        lobbyScene.visible = false;
        selectScene.visible = true;
        selectSetup();
    });

    socket.on("show_opponent", (message, playerChoices) => {
        console.log(message.msg);
        console.log(playerChoices);

        switch (playerChoices[0]) {
            case('Jeff Bezos'):
                spriteBezos.anchor.set(0.5);
                spriteBezos.x = -100;
                gameScene.addChild(spriteBezos);
                break;
            case('Elon Musk'):
                spriteMusk.anchor.set(0.5);
                spriteMusk.x = -100;
                gameScene.addChild(spriteMusk);
                break;
            case('Mark Zuckerberg'):
                spriteZuck.anchor.set(0.5);
                spriteZuck.x = -100;
                gameScene.addChild(spriteZuck);
                break;
            case('Tim Cook'):
                spriteCook.anchor.set(0.5);
                spriteCook.x = -100;
                gameScene.addChild(spriteCook);
                break;
        }

        switch (playerChoices[1]) {
            case('Jeff Bezos'):
                spriteBezos.anchor.set(0.5);
                spriteBezos.x = 100;
                gameScene.addChild(spriteBezos);
                break;
            case('Elon Musk'):
                spriteMusk.anchor.set(0.5);
                spriteMusk.x = 100;
                gameScene.addChild(spriteMusk);
                break;
            case('Mark Zuckerberg'):
                spriteZuck.anchor.set(0.5);
                spriteZuck.x = 100;
                gameScene.addChild(spriteZuck);
                break;
            case('Tim Cook'):
                spriteCook.anchor.set(0.5);
                spriteCook.x = 100;
                gameScene.addChild(spriteCook);
                break;
        }
    });

    socket.on("select_char", (message) => {
        console.log(message.msg);
        selectScene.visible = false;
        gameScene.visible = true;
        gameSetup();
    });

    socket.on("battle", (message, p1hp, p2hp) => {
        player1hp.text = p1hp;
        player2hp.text = p2hp;
    });

    socket.on("setup_victory", (message, winner) => {
        console.log(message.msg);
        victorySetup(winner);

        gameScene.visible = false;
        victoryScene.visible = true;
    });


    // SOCKET - SENDING MESSAGES TO SERVER

    create.on('pointerdown', function() {
        socket.emit("CREATE_ROOM");
    });

    join.on('pointerdown', function() {
        let roomcode = document.querySelector("input").value
        socket.emit("JOIN_ROOM", roomcode);
        console.log("Attempting to join room " + roomcode);
    });

    punch.on('pointerdown', function() {
        socket.emit("READY", currentRoom);
    });

    selectBezos.on('pointerdown', function() {
        socket.emit("CHARACTER_SUBMIT", 1, currentRoom);
    });

    selectMusk.on('pointerdown', function() {
        socket.emit("CHARACTER_SUBMIT", 2, currentRoom);
    });
    selectZuck.on('pointerdown', function() {
        socket.emit("CHARACTER_SUBMIT", 3, currentRoom);
    });
    selectCook.on('pointerdown', function() {
        socket.emit("CHARACTER_SUBMIT", 4, currentRoom);
    });

    atk1.on('pointerdown', function() {
        socket.emit("ATK_SUBMIT", 1, currentRoom);
    });
    atk2.on('pointerdown', function() {
        socket.emit("ATK_SUBMIT", 2, currentRoom);
    });
    atk3.on('pointerdown', function() {
        socket.emit("ATK_SUBMIT", 3, currentRoom);
    });
    atk4.on('pointerdown', function() {
        socket.emit("ATK_SUBMIT", 4, currentRoom);
    });

    victoryText.on('pointerdown', function() {
        //socket.emit("VICTORY_CONTINUE");
        //console.log("hello");
    });

};




