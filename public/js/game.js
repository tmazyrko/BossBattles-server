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
let bezosText = new PIXI.Text("0");
let muskText = new PIXI.Text("0");
let zuckText = new PIXI.Text("0");
let cookText = new PIXI.Text("0");
const selectBezos = PIXI.Sprite.from('../img/select-bezos.png');
const selectMusk = PIXI.Sprite.from('../img/select-musk.png');
const selectZuck = PIXI.Sprite.from('../img/select-zuck.png');
const selectCook = PIXI.Sprite.from('../img/select-cook.png');
let atk1 = new PIXI.Text("Attack 1");
let atk2 = new PIXI.Text("Attack 2");
let atk3 = new PIXI.Text("Attack 3");
let atk4 = new PIXI.Text("Attack 4");
let player1hp = new PIXI.Text("100");
let player2hp = new PIXI.Text("100");
let victoryText = new PIXI.Text("WINNER IS...");
let continueText = new PIXI.Text("Continue");
let unlockText = new PIXI.Text("YOU'VE UNLOCKED A NEW FIGHTER!");
let spriteBezos = PIXI.Sprite.from('../img/sprite-bezos.png');
let spriteMusk = PIXI.Sprite.from('../img/sprite-musk.png');
let spriteZuck = PIXI.Sprite.from('../img/sprite-zuck.png');
let spriteCook = PIXI.Sprite.from('../img/sprite-cook.png');
let playerSprites = [];
let bezosNum = 0;
let muskNum = 0;
let zuckNum = 0;
let cookNum = 0;

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
        console.log(parent.clientWidth, parent.clientHeight);
        console.log(app.screen.width, app.screen.height);

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
    window.addEventListener('resize', resizeMatch);

    matchText.anchor.set(0.5);
    matchText.style = new PIXI.TextStyle(({
        fill: 0x158233,
        fontSize: 60,
        fontFamily: 'Press Start 2P',
    }));

    matchText.style.stroke = 0x000000;


    create.anchor.set(0.5);


    join.anchor.set(0.5);

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

    input.pivot.x = input.width / 2;
    input.pivot.y = input.height / 2;
    matchScene.addChild(input);

    function resizeMatch() {

        if (app.screen.width < 800 && app.screen.width >= 400) {
            matchText.style.fontSize = 40;
            create.width = 360;
            create.height = 108;
            join.width = 360;
            join.height = 108;
            input.width = 360;
            matchText.y = -240;
            matchText.style.strokeThickness = 7;
            create.y = -80;
            join.y = 60;
            input.y = 190;
        }
        else if (app.screen.width < 400) {
            matchText.style.fontSize = 20;
            create.width = 216;
            create.height = 65;
            join.width = 216;
            join.height = 65;
            input.width = 216;
            matchText.y = -140;
            matchText.style.strokeThickness = 3;
            create.y = -40;
            join.y = 40;
            input.y = 140;
        }
        else {
            matchText.style.fontSize = 60;
            create.width = 400;
            create.height = 120;
            join.width = 400;
            join.height = 120;
            input.width = 400;
            matchText.y = -240;
            matchText.style.strokeThickness = 7;
            create.y = -80;
            join.y = 60;
            input.y = 190;
        }
    }

    resizeMatch();

    /*join.on('pointerdown', (e) => {
        matchScene.visible = false;
        lobbyScene.visible = true;
        lobbySetup();
    });*/
}

// Lobby scene setup function

const lobbySetup = function() {
    window.addEventListener('resize', resizeLobby);

    lobbyScene.addChild(lobby);
    lobby.anchor.set(0.5);

    readyText.anchor.set(0.5);
    readyText.y = -70;
    readyText.style = new PIXI.TextStyle(({
        fill: 0x4F6F9E,
        fontSize: 40,
        fontFamily: 'Press Start 2P',
        fontStyle: 'bold',
    }));

    readyText.style.stroke = 0x000000;

    playerText.anchor.set(0.5);
    playerText.style = new PIXI.TextStyle(({
        fill: 0x6F1515,
        fontSize: 35,
        fontFamily: 'Press Start 2P',
    }));

    opponentText.anchor.set(0.5);
    opponentText.style = new PIXI.TextStyle(({
        fill: 0x6F1515,
        fontSize: 35,
        fontFamily: 'Press Start 2P',
    }));

    lobbyScene.addChild(readyText);
    lobbyScene.addChild(playerText);
    lobbyScene.addChild(opponentText);

    lobbyScene.addChild(punch);
    punch.anchor.set(0.5);

    punch.interactive = true;
    punch.buttonMode = true;

    function resizeLobby() {

        if (app.screen.width < 1200 && app.screen.width >= 900) {
            readyText.visible = true;
            lobby.y = -270;
            lobby.width = 500;
            lobby.height = 160;
            readyText.style.fontSize = 27;
            readyText.visible = true;
            readyText.style.strokeThickness = 5;
            punch.y = 100;
            playerText.style.fontSize = 27;
            opponentText.style.fontSize = 27;
            punch.width = 250;
            punch.height = 200;
            playerText.y = 270;
            opponentText.y = 340;
        }
        else if (app.screen.width < 900 && app.screen.width >= 800) {
            readyText.visible = true;
            lobby.y = -270;
            lobby.width = 500;
            lobby.height = 160;
            readyText.style.fontSize = 23;
            readyText.style.strokeThickness = 4;
            punch.y = 100;
            playerText.style.fontSize = 23;
            opponentText.style.fontSize = 23;
            punch.width = 250;
            punch.height = 200;
            playerText.y = 270;
            opponentText.y = 340;
        }
        else if (app.screen.width < 800 && app.screen.width >= 540) {
            lobby.width = 440;
            lobby.height = 150;
            lobby.y = -200;
            readyText.visible = false;
            punch.y = 40;
            playerText.style.fontSize = 19;
            opponentText.style.fontSize = 19;
            punch.width = 200;
            punch.height = 150;
            playerText.y = 190;
            opponentText.y = 260;
        }
        else if (app.screen.width < 540 && app.screen.width >= 400) {
            lobby.width = 380;
            lobby.height = 100;
            lobby.y = -130;
            readyText.visible = false;
            punch.y = 30;
            playerText.style.fontSize = 10;
            opponentText.style.fontSize = 10;
            punch.width = 180;
            punch.height = 130;
            playerText.y = 150;
            opponentText.y = 190;
        }
        else if (app.screen.width < 400) {
            lobby.width = 250;
            lobby.height = 90;
            lobby.y = -140;
            readyText.visible = false;
            punch.y = 20;
            playerText.style.fontSize = 10;
            opponentText.style.fontSize = 9;
            punch.width = 170;
            punch.height = 120;
            playerText.y = 120;
            opponentText.y = 170;
        }
        else {
            readyText.visible = true;
            lobby.y = -270;
            lobby.width = 600;
            lobby.height = 192;
            readyText.style.fontSize = 35;
            readyText.style.strokeThickness = 6;
            punch.y = 100;
            playerText.style.fontSize = 35;
            opponentText.style.fontSize = 35;
            punch.width = 250;
            punch.height = 200;
            playerText.y = 270;
            opponentText.y = 340;
        }
    }

    resizeLobby();
}

// Select scene setup function

const selectSetup = function() {
    window.addEventListener('resize', resizeSelect);

    selectText.anchor.set(0.5);
    selectText.style = new PIXI.TextStyle(({
        fill: 0x4F6F9E,
        fontSize: 40,
        fontFamily: 'Press Start 2P',
        fontStyle: 'bold',
    }));
    bezosText.text = bezosNum;
    bezosText.anchor.set(0.5);
    bezosText.style = new PIXI.TextStyle(({
        fill: 0x4F6F9E,
        fontSize: 40,
        fontFamily: 'Press Start 2P',
        fontStyle: 'bold',
    }));
    muskText.text = muskNum;
    muskText.anchor.set(0.5);
    muskText.style = new PIXI.TextStyle(({
        fill: 0x4F6F9E,
        fontSize: 40,
        fontFamily: 'Press Start 2P',
        fontStyle: 'bold',
    }));
    zuckText.text = zuckNum;
    zuckText.anchor.set(0.5);
    zuckText.style = new PIXI.TextStyle(({
        fill: 0x4F6F9E,
        fontSize: 40,
        fontFamily: 'Press Start 2P',
        fontStyle: 'bold',
    }));
    cookText.text = cookNum;
    cookText.anchor.set(0.5);
    cookText.style = new PIXI.TextStyle(({
        fill: 0x4F6F9E,
        fontSize: 40,
        fontFamily: 'Press Start 2P',
        fontStyle: 'bold',
    }));

    selectText.style.stroke = 0x000000;
    selectText.style.strokeThickness = 6;
    bezosText.style.stroke = 0x000000;
    bezosText.style.strokeThickness = 6;
    muskText.style.stroke = 0x000000;
    muskText.style.strokeThickness = 6;
    zuckText.style.stroke = 0x000000;
    zuckText.style.strokeThickness = 6;
    cookText.style.stroke = 0x000000;
    cookText.style.strokeThickness = 6;

    selectScene.addChild(selectText);
    selectScene.addChild(bezosText);
    selectScene.addChild(muskText);
    selectScene.addChild(zuckText);
    selectScene.addChild(cookText);

    selectBezos.anchor.set(0.5);

    selectMusk.anchor.set(0.5);

    selectZuck.anchor.set(0.5);

    selectCook.anchor.set(0.5);

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

    function resizeSelect() {

        if (app.screen.width < 1200 && app.screen.width >= 900) {
            selectText.style.fontSize = 40;
            selectText.style.strokeThickness = 6;
            selectText.y = -300;

            selectBezos.width = 200;
            selectBezos.height = 200;
            selectBezos.y = 40;
            selectBezos.x = -330;
            bezosText.style.fontSize = 30;
            bezosText.style.strokeThickness = 6;
            bezosText.y = 180;
            bezosText.x = -335;

            selectMusk.width = 200;
            selectMusk.height = 200;
            selectMusk.y = 40;
            selectMusk.x = -110;
            muskText.style.fontSize = 30;
            muskText.style.strokeThickness = 6;
            muskText.y = 180;
            muskText.x = -115;

            selectZuck.width = 200;
            selectZuck.height = 200;
            selectZuck.y = 40;
            selectZuck.x = 110;
            zuckText.style.fontSize = 30;
            zuckText.style.strokeThickness = 6;
            zuckText.y = 180;
            zuckText.x = 105;

            selectCook.width = 200;
            selectCook.height = 200;
            selectCook.y = 40;
            selectCook.x = 330;
            cookText.style.fontSize = 30;
            cookText.style.strokeThickness = 6;
            cookText.y = 180;
            cookText.x = 325;
        }
        else if (app.screen.width < 900 && app.screen.width >= 400) {
            selectText.style.fontSize = 20;
            selectText.style.strokeThickness = 6;
            selectText.y = -190;

            selectBezos.width = 150;
            selectBezos.height = 150;
            selectBezos.y = -70;
            selectBezos.x = -80;
            bezosText.style.fontSize = 20;
            bezosText.style.strokeThickness = 6;
            bezosText.y = 25;
            bezosText.x = -70;

            selectMusk.width = 150;
            selectMusk.height = 150;
            selectMusk.y = -70;
            selectMusk.x = 100;
            muskText.style.fontSize = 20;
            muskText.style.strokeThickness = 6;
            muskText.y = 25;
            muskText.x = 100;

            selectZuck.width = 150;
            selectZuck.height = 150;
            selectZuck.y = 120;
            selectZuck.x = -80;
            zuckText.style.fontSize = 20;
            zuckText.style.strokeThickness = 6;
            zuckText.y = 220;
            zuckText.x = -70;

            selectCook.width = 150;
            selectCook.height = 150;
            selectCook.y = 120;
            selectCook.x = 100;
            cookText.style.fontSize = 20;
            cookText.style.strokeThickness = 6;
            cookText.y = 220;
            cookText.x = 90;
        }
        else if (app.screen.width < 400) {
            selectText.style.fontSize = 10;
            selectText.style.strokeThickness = 2;
            selectText.y = -130;

            selectBezos.width = 70;
            selectBezos.height = 70;
            selectBezos.y = -40;
            selectBezos.x = -50;
            bezosText.style.fontSize = 13;
            bezosText.style.strokeThickness = 3;
            bezosText.y = 15;
            bezosText.x = -50;

            selectMusk.width = 70;
            selectMusk.height = 70;
            selectMusk.y = -40;
            selectMusk.x = 50;
            muskText.style.fontSize = 13;
            muskText.style.strokeThickness = 3;
            muskText.y = 15;
            muskText.x = 50;

            selectZuck.width = 70;
            selectZuck.height = 70;
            selectZuck.y = 70;
            selectZuck.x = -50;
            zuckText.style.fontSize = 13;
            zuckText.style.strokeThickness = 3;
            zuckText.y = 120;
            zuckText.x = -50;

            selectCook.width = 70;
            selectCook.height = 70;
            selectCook.y = 70;
            selectCook.x = 50;
            cookText.style.fontSize = 13;
            cookText.style.strokeThickness = 3;
            cookText.y = 120;
            cookText.x = 50;
        }
        else {
            selectText.style.fontSize = 40;
            selectText.style.strokeThickness = 6;
            selectText.y = -300;

            selectBezos.width = 240;
            selectBezos.height = 240;
            selectBezos.y = 60;
            selectBezos.x = -450;
            bezosText.style.fontSize = 40;
            bezosText.style.strokeThickness = 6;
            bezosText.y = 225;
            bezosText.x = -450;

            selectMusk.width = 240;
            selectMusk.height = 240;
            selectMusk.y = 60;
            selectMusk.x = -150;
            muskText.style.fontSize = 40;
            muskText.style.strokeThickness = 6;
            muskText.y = 225;
            muskText.x = -150;

            selectZuck.width = 240;
            selectZuck.height = 240;
            selectZuck.y = 60;
            selectZuck.x = 150;
            zuckText.style.fontSize = 40;
            zuckText.style.strokeThickness = 6;
            zuckText.y = 225;
            zuckText.x = 150;

            selectCook.width = 240;
            selectCook.height = 240;
            selectCook.y = 60;
            selectCook.x = 450;
            cookText.style.fontSize = 40;
            cookText.style.strokeThickness = 6;
            cookText.y = 225;
            cookText.x = 450;
        }
    }

    resizeSelect();
}

// Game scene setup function

const gameSetup = function() {
    window.addEventListener('resize', resizeGame);

    atk1.anchor.set(0.5);
    atk1.style = new PIXI.TextStyle(({
        fill: 0x4F6F9E,
        fontFamily: 'Press Start 2P',
        fontSize: 24,
        wordWrap: true,
        wordWrapWidth: 30,
        align: 'center',
    }));

    atk1.style.stroke = 0x000000;
    atk1.style.strokeThickness = 3;

    atk2.anchor.set(0.5);
    atk2.style = new PIXI.TextStyle(({
        fill: 0x4F6F9E,
        fontFamily: 'Press Start 2P',
        fontSize: 24,
        wordWrap: true,
        wordWrapWidth: 30,
        align: 'center',
    }));

    atk2.style.stroke = 0x000000;
    atk2.style.strokeThickness = 3;

    atk3.anchor.set(0.5);
    atk3.style = new PIXI.TextStyle(({
        fill: 0x4F6F9E,
        fontFamily: 'Press Start 2P',
        fontSize: 24,
        wordWrap: true,
        wordWrapWidth: 30,
        align: 'center',
    }));

    atk3.style.stroke = 0x000000;
    atk3.style.strokeThickness = 3;

    atk4.anchor.set(0.5);
    atk4.style = new PIXI.TextStyle(({
        fill: 0x4F6F9E,
        fontFamily: 'Press Start 2P',
        fontSize: 24,
        wordWrap: true,
        wordWrapWidth: 30,
        align: 'center',
    }));

    atk4.style.stroke = 0x000000;
    atk4.style.strokeThickness = 3;

    gameScene.addChild(atk1);
    gameScene.addChild(atk2);
    gameScene.addChild(atk3);
    gameScene.addChild(atk4);

    atk1.interactive = true;
    atk1.buttonMode = true;

    atk2.interactive = true;
    atk2.buttonMode = true;

    atk3.interactive = true;
    atk3.buttonMode = true;

    atk4.interactive = true;
    atk4.buttonMode = true;

    playerSprites[0].anchor.set(0.5);
    gameScene.addChild(playerSprites[0]);

    playerSprites[1].anchor.set(0.5);
    gameScene.addChild(playerSprites[1]);

    player1hp.anchor.set(0.5);
    player1hp.style = new PIXI.TextStyle(({
        fill: 0x158233,
        fontFamily: 'Press Start 2P',
        fontStyle: 'bold',
    }));

    player2hp.anchor.set(0.5);
    player2hp.style = new PIXI.TextStyle(({
        fill: 0x158233,
        fontFamily: 'Press Start 2P',
        fontStyle: 'bold',
    }));

    gameScene.addChild(player1hp);
    gameScene.addChild(player2hp);

    function resizeGame() {

        if (app.screen.width < 1200 && app.screen.width >= 800) {
            player1hp.y = -190;
            player1hp.x = -300;
            player1hp.style.fontSize = 40;
            player1hp.style.stroke = 0x000000;
            player1hp.style.strokeThickness = 3;

            player2hp.y = -190;
            player2hp.x = 300;
            player2hp.style.fontSize = 40;
            player2hp.style.stroke = 0x000000;
            player2hp.style.strokeThickness = 3;

            playerSprites[0].x = -300;
            playerSprites[0].y = 20;
            playerSprites[1].x = 300;
            playerSprites[1].y = 20;

            atk1.y = 260;
            atk1.x = -300;
            atk1.style.fontSize = 17;
            atk2.y = 260;
            atk2.x = -100;
            atk2.style.fontSize = 17;
            atk3.y = 260;
            atk3.x = 100;
            atk3.style.fontSize = 17;
            atk4.y = 260;
            atk4.x = 300;
            atk4.style.fontSize = 17;
        }
        else if (app.screen.width < 800) {
            player1hp.y = -190;
            player1hp.x = -150;
            player1hp.style.fontSize = 30;
            player1hp.style.stroke = 0x000000;
            player1hp.style.strokeThickness = 3;

            player2hp.y = -190;
            player2hp.x = 150;
            player2hp.style.fontSize = 30;
            player2hp.style.stroke = 0x000000;
            player2hp.style.strokeThickness = 3;

            playerSprites[0].x = -150;
            playerSprites[0].y = 20;
            playerSprites[1].x = 150;
            playerSprites[1].y = 20;

            atk1.y = 260;
            atk1.x = -160;
            atk1.style.fontSize = 10;
            atk2.y = 260;
            atk2.x = -50;
            atk2.style.fontSize = 10;
            atk3.y = 260;
            atk3.x = 50;
            atk3.style.fontSize = 10;
            atk4.y = 260;
            atk4.x = 160;
            atk4.style.fontSize = 10;
        }
        else {
            player1hp.width = 90;
            player1hp.height = 45;
            player1hp.y = -190;
            player1hp.x = -420;
            player1hp.style.fontSize = 40;
            player1hp.style.stroke = 0x000000;
            player1hp.style.strokeThickness = 3;

            player2hp.width = 90;
            player2hp.height = 45;
            player2hp.y = -190;
            player2hp.x = 420;
            player2hp.style.fontSize = 40;
            player2hp.style.stroke = 0x000000;
            player2hp.style.strokeThickness = 3;

            playerSprites[0].width = 110;
            playerSprites[0].height = 300;
            playerSprites[0].x = -420;
            playerSprites[0].y = 30;

            playerSprites[1].width = 110;
            playerSprites[1].height = 300;
            playerSprites[1].x = 420;
            playerSprites[1].y = 30;

            atk1.y = 300;
            atk1.x = -450;
            atk1.style.fontSize = 24;
            atk2.y = 300;
            atk2.x = -150;
            atk2.style.fontSize = 24;
            atk3.y = 300;
            atk3.x = 150;
            atk3.style.fontSize = 24;
            atk4.y = 300;
            atk4.x = 450;
            atk4.style.fontSize = 24;
        }
    }

    resizeGame();
}

// Victory scene setup function

const victorySetup = function (winner, index) {
    window.addEventListener('resize', resizeVictory);

    let winnerText = new PIXI.Text(winner);

    let victor = playerSprites[index];
    victor.anchor.set(0.5);
    victor.x = 0;

    victoryScene.addChild(victor);

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

    continueText.anchor.set(0.5);
    continueText.y = 240;
    continueText.style = new PIXI.TextStyle(({
        fill: 0x158233,
        fontSize: 30,
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
    continueText.style.stroke = 0x000000;
    continueText.style.strokeThickness = 4;

    victoryScene.addChild(victoryText);
    victoryScene.addChild(winnerText);
    victoryScene.addChild(continueText);

    continueText.interactive = true;
    continueText.buttonMode = true;

    function resizeVictory() {

        if (app.screen.width < 1200 && app.screen.width >= 800) {

        }
        else if (app.screen.width < 800) {
            // player1hp.y = -190;
            // player1hp.x = -150;
            // player1hp.style.fontSize = 30;
            // player1hp.style.stroke = 0x000000;
            // player1hp.style.strokeThickness = 3;
            //
            // player2hp.y = -190;
            // player2hp.x = 150;
            // player2hp.style.fontSize = 30;
            // player2hp.style.stroke = 0x000000;
            // player2hp.style.strokeThickness = 3;
            //
            // playerSprites[0].x = -150;
            // playerSprites[0].y = 20;
            // playerSprites[1].x = 150;
            // playerSprites[1].y = 20;
            //
            // atk1.y = 260;
            // atk1.x = -160;
            // atk1.style.fontSize = 10;
            // atk2.y = 260;
            // atk2.x = -50;
            // atk2.style.fontSize = 10;
            // atk3.y = 260;
            // atk3.x = 50;
            // atk3.style.fontSize = 10;
            // atk4.y = 260;
            // atk4.x = 160;
            // atk4.style.fontSize = 10;
        }
        else {

        }
    }

    resizeVictory();
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

    socket.on("stock_data", (amzn, tsla, fb, aapl) => {
        bezosNum = amzn;
        muskNum = tsla;
        zuckNum = fb;
        cookNum = aapl;
    });

    socket.on("show_moves", (message, playerMoves) => {
        console.log(message.msg);
        console.log(playerMoves);

        atk1.text = playerMoves[0];
        atk2.text = playerMoves[1];
        atk3.text = playerMoves[2];
        atk4.text = playerMoves[3];
    });

    socket.on("show_opponent", (message, playerChoices) => {
        console.log(message.msg);
        console.log(playerChoices);

        switch (playerChoices[0]) {
            case('Jeff Bezos'):
                playerSprites.push(spriteBezos);
                break;
            case('Elon Musk'):
                playerSprites.push(spriteMusk);
                break;
            case('Mark Zuckerberg'):
                playerSprites.push(spriteZuck);
                break;
            case('Tim Cook'):
                playerSprites.push(spriteCook);
                break;
        }

        switch (playerChoices[1]) {
            case('Jeff Bezos'):
                playerSprites.push(spriteBezos);
                break;
            case('Elon Musk'):
                playerSprites.push(spriteMusk);
                break;
            case('Mark Zuckerberg'):
                playerSprites.push(spriteZuck);
                break;
            case('Tim Cook'):
                playerSprites.push(spriteCook);
                break;
        }
    });

    socket.on("select_char", (message) => {
        console.log(message.msg);
        selectScene.visible = false;
        gameScene.visible = true;
        gameSetup();
    });

    socket.on("battle", (message, playerHp) => {
        player1hp.text = playerHp[0];
        player2hp.text = playerHp[1];
    });

    let p1combat = false;
    let p2combat = false;
    let count = 0;
    socket.on("combat", (message) => {
       console.log(message.msg);

        app.ticker.start();
        app.ticker.add(() => {
            if (p1combat === false) {
                playerSprites[0].x += 10;
                count++;

                if (count >= 10) {
                    p1combat = true;
                }
            }
            else {
                playerSprites[0].x -= 10;
                count--;

                if (count <= 0) {
                    p1combat = false;
                    console.log(`checking p1com: ${p1combat}`);
                    app.ticker.stop();
                }
            }

            app.ticker.start();
            if (p2combat === false) {
                playerSprites[1].x -= 10;
                count++;

                if (count >= 10) {
                    p2combat = true;
                }
            }
            else {
                playerSprites[1].x += 10;
                count--;

                if (count <= 0) {
                    p2combat = false;
                    app.ticker.stop();
                }
            }
        });
    });

    socket.on("setup_victory", (message, winner, index) => {
        console.log(message.msg);
        console.log(index);
        victorySetup(winner, index);

        gameScene.visible = false;
        victoryScene.visible = true;
    });

    socket.on("continue", (message) => {
        console.log(message.msg);

        victoryScene.visible = false;
        matchScene.visible = true;
    });

    socket.on("unlock", (message) => {
        console.log(message.msg);

        victoryScene.visible = false;
        unlockScene.visible = true;
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

    continueText.on('pointerdown', function() {
        socket.emit("VICTORY_CONTINUE");
        console.log("continue");
    });

};




