// PixiJS Game Canvas

// Variable declaration for game & different scenes

let app, matchScene, lobbyScene, selectScene, gameScene, victoryScene, unlockScene;

const create = PIXI.Sprite.from('../img/create-button.png');
const join = PIXI.Sprite.from('../img/join-button.png');
const lobby = PIXI.Sprite.from('../img/lobby-logo.png');
let readyText = new PIXI.Text("PRESS ENTER WHEN READY!");
let playerText = new PIXI.Text("Waiting for you...");
let opponentText = new PIXI.Text("Waiting for your opponent...");
let selectText = new PIXI.Text("PLAYER SELECT");
const bezos = PIXI.Sprite.from('../img/select-bezos.png');
const musk = PIXI.Sprite.from('../img/select-musk.png');
const zuck = PIXI.Sprite.from('../img/select-zuck.png');
const cook = PIXI.Sprite.from('../img/select-cook.png');
let gameText = new PIXI.Text("GAME SCENE");
let atk1 = PIXI.Sprite.from('../img/atk1.png');
let atk2 = PIXI.Sprite.from('../img/atk2.png');
let atk3 = PIXI.Sprite.from('../img/atk3.png');
let atk4 = PIXI.Sprite.from('../img/atk4.png');
let victoryText = new PIXI.Text("THIS PLAYER WINS!!!");
let unlockText = new PIXI.Text("YOU'VE UNLOCKED A NEW FIGHTER!");

// Initial load in function

const init = function() {
    app = new PIXI.Application({
        backgroundColor: 0xffffff,
        resolution: window.devicePixelRatio || 1
    });

    app.renderer.resize(window.innerWidth, window.innerHeight);
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

    app.stage.addChild(matchScene);
    app.stage.addChild(lobbyScene);
    app.stage.addChild(selectScene);
    app.stage.addChild(gameScene);
    app.stage.addChild(victoryScene);
    app.stage.addChild(unlockScene);
}

// Match scene setup function

const matchSetup = function() {
    matchScene.x = app.screen.width / 2;
    matchScene.y = app.screen.height / 2;

    create.scale.set(1.5, 1.5);
    create.anchor.set(0.5);
    create.y = -50;
    join.scale.set(1.5, 1.5);
    join.anchor.set(0.5);
    join.y = 100;

    create.interactive = true;
    create.buttonMode = true;
    join.interactive = true;
    join.buttonMode = true;

    matchScene.addChild(create);
    matchScene.addChild(join);

    let input = new PIXI.TextInput({
        input: {
            fontFamily: 'Press Start 2P',
            fontSize: '25px',
            padding: '15px',
            width: '450px',
            color: '#26272E',
        },
        box: {
            default: {fill: 0xE8E9F3, rounded: 12, stroke: {color: 0xCBCEE0, width: 3}},
            focused: {fill: 0xE1E3EE, rounded: 12, stroke: {color: 0xABAFC6, width: 3}},
            disabled: {fill: 0xDBDBDB, rounded: 12}
        }
    })

    input.placeholder = 'Enter room code';
    input.y = 220;
    input.pivot.x = input.width / 2;
    input.pivot.y = input.height / 2;
    matchScene.addChild(input);

    join.on('pointerdown', (e) => {
        matchScene.visible = false;
        lobbyScene.visible = true;
        lobbySetup();
    });
}

// Lobby scene setup function

const lobbySetup = function() {
    lobbyScene.x = app.screen.width / 2;
    lobbyScene.y = app.screen.height / 2;

    lobbyScene.addChild(lobby);
    lobby.scale.set(1.3, 1.3);
    lobby.anchor.set(0.5);
    lobby.y = -350;

    readyText.anchor.set(0.5);
    readyText.y = 80;
    readyText.style = new PIXI.TextStyle(({
        fill: 0x000000,
        fontSize: 50,
        fontFamily: 'Press Start 2P',
        fontStyle: 'bold',
    }));

    playerText.anchor.set(0.5);
    playerText.y = 350;
    playerText.style = new PIXI.TextStyle(({
        fill: 0x6F1515,
        fontSize: 40,
        fontFamily: 'Press Start 2P',
    }));

    opponentText.anchor.set(0.5);
    opponentText.y = 450;
    opponentText.style = new PIXI.TextStyle(({
        fill: 0x6F1515,
        fontSize: 40,
        fontFamily: 'Press Start 2P',
    }));

    lobbyScene.addChild(readyText);
    lobbyScene.addChild(playerText);
    lobbyScene.addChild(opponentText);

    document.addEventListener("keydown", readyUp);

    function readyUp(e) {
        if (e.keyCode === 13) {
            alert("ready!!!");
            lobbyScene.visible = false;
            selectScene.visible = true;
            selectSetup();
        }
    }
}

// Select scene setup function

const selectSetup = function() {
    selectScene.x = app.screen.width / 2;
    selectScene.y = app.screen.height / 2;

    selectText.anchor.set(0.5);
    selectText.y = -350;
    selectText.style = new PIXI.TextStyle(({
        fill: 0x000000,
        fontSize: 70,
        fontFamily: 'Press Start 2P',
        fontStyle: 'bold',
    }));

    selectScene.addChild(selectText);

    bezos.scale.set(1.5, 1.5);
    bezos.anchor.set(0.5);
    bezos.y = 60;
    bezos.x = -600;
    musk.scale.set(1.5, 1.5);
    musk.anchor.set(0.5);
    musk.y = 60;
    musk.x = -200;
    zuck.scale.set(1.5, 1.5);
    zuck.anchor.set(0.5);
    zuck.y = 60;
    zuck.x = 200;
    cook.scale.set(1.5, 1.5);
    cook.anchor.set(0.5);
    cook.y = 60;
    cook.x = 600;

    bezos.interactive = true;
    bezos.buttonMode = true;

    selectScene.addChild(bezos);
    selectScene.addChild(musk);
    selectScene.addChild(zuck);
    selectScene.addChild(cook);

    bezos.on('pointerdown', (event) => {
        selectScene.visible = false;
        gameScene.visible = true;
        gameSetup();
    });
}

// Game scene setup function

const gameSetup = function() {
    gameScene.x = app.screen.width / 2;
    gameScene.y = app.screen.height / 2;

    gameText.anchor.set(0.5);
    gameText.y = -350;
    gameText.style = new PIXI.TextStyle(({
        fill: 0x00000,
        fontSize: 40,
        fontFamily: 'Press Start 2P',
    }));

    atk1.y = 300;
    atk1.x = -400;
    atk1.anchor.set(0.5);
    atk2.y = 300;
    atk2.x = -100;
    atk2.anchor.set(0.5);
    atk3.y = 300;
    atk3.x = 200;
    atk3.anchor.set(0.5);
    atk4.y = 300;
    atk4.x = 500;
    atk4.anchor.set(0.5);

    gameScene.addChild(gameText);
    gameScene.addChild(atk1);
    gameScene.addChild(atk2);
    gameScene.addChild(atk3);
    gameScene.addChild(atk4);

    atk1.interactive = true;
    atk1.buttonMode = true;

    atk1.on('pointerdown', (event) => {
        gameScene.visible = false;
        victoryScene.visible = true;
        victorySetup();
    });
}

// Victory scene setup function

const victorySetup = function () {
    victoryScene.x = app.screen.width / 2;
    victoryScene.y = app.screen.height / 2;

    victoryText.anchor.set(0.5);
    victoryText.y = -350;
    victoryText.style = new PIXI.TextStyle(({
        fill: 0x00000,
        fontSize: 40,
        fontFamily: 'Press Start 2P',
    }));

    victoryScene.addChild(victoryText);

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
    unlockScene.x = app.screen.width / 2;
    unlockScene.y = app.screen.height / 2;

    unlockText.anchor.set(0.5);
    unlockText.y = -350;
    unlockText.style = new PIXI.TextStyle(({
        fill: 0x00000,
        fontSize: 40,
        fontFamily: 'Press Start 2P',
    }));

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
    matchSetup();

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
    });

    socket.on("change_scene_to_victory", (winner) => { // Use winner var (if needed, bring in more info from the server) to populate the victory scene with info/images/whatever
        gameScene.visible = false;
        victoryScene.visible = true;
        victorySetup();
    });


    // SOCKET - SENDING MESSAGES TO SERVER

    create.on('pointerdown', function() {
        socket.emit("CREATE_ROOM");
    });

    join.on('pointerdown', function() {
        socket.emit("JOIN_ROOM", "room1");
        console.log(document.querySelector("input").value);
    });

    atk1.on('pointerdown', atkSubmit(1));
    atk2.on('pointerdown', atkSubmit(2));
    atk3.on('pointerdown', atkSubmit(3));
    atk4.on('pointerdown', atkSubmit(4));

    function atkSubmit(atk){
        socket.emit("ATK_SUBMIT", atk);
    }

    victoryText.on('pointerdown', function() {
        //socket.emit("VICTORY_CONTINUE");
        //console.log("hello");
    });

};




