// // PixiJS Game Canvas
//
// // Variable declaration for different scenes
//
// let app;
// let matchScene;
// let lobbyScene;
// let selectScene;
// let gameScene;
// let victoryScene;
// let unlockScene;
//
// // Initial load in function
//
// const init = function() {
//
// }
//
// window.onload = function() {
//
//     // Create canvas
//
//     app = new PIXI.Application({
//         backgroundColor: 0xffffff,
//         resolution: window.devicePixelRatio || 1
//     });
//
//     app.renderer.resize(window.innerWidth, window.innerHeight);
//     document.querySelector(".content-ctr").appendChild(app.view);
//
//     // **Add eventListener for scene changes here, CHANGE LATER**
//     window.addEventListener("keydown", switchScenes);
//
//     // Function for switching scenes
//
//     function switchScenes(e) {
//         switch (e.key) {
//             case "1":
//                 matchScene.visible = true;
//                 lobbyScene.visible = false;
//                 selectScene.visible = false;
//                 gameScene.visible = false;
//                 victoryScene.visible = false;
//                 unlockScene.visible = false;
//                 break;
//             case "2":
//                 matchScene.visible = false;
//                 lobbyScene.visible = true;
//                 selectScene.visible = false;
//                 gameScene.visible = false;
//                 victoryScene.visible = false;
//                 unlockScene.visible = false;
//                 break;
//             case "3":
//                 matchScene.visible = false;
//                 lobbyScene.visible = false;
//                 selectScene.visible = true;
//                 gameScene.visible = false;
//                 victoryScene.visible = false;
//                 unlockScene.visible = false;
//                 break;
//             case "4":
//                 matchScene.visible = false;
//                 lobbyScene.visible = false;
//                 selectScene.visible = false;
//                 gameScene.visible = true;
//                 victoryScene.visible = false;
//                 unlockScene.visible = false;
//                 break;
//             case "5":
//                 matchScene.visible = false;
//                 lobbyScene.visible = false;
//                 selectScene.visible = false;
//                 gameScene.visible = false;
//                 victoryScene.visible = true;
//                 unlockScene.visible = false;
//                 break;
//             case "6":
//                 matchScene.visible = false;
//                 lobbyScene.visible = false;
//                 selectScene.visible = false;
//                 gameScene.visible = false;
//                 victoryScene.visible = false;
//                 unlockScene.visible = true;
//                 break;
//         }
//     }
//
//     // Initialization for scene containers
//
//     matchScene = new PIXI.Container();
//     lobbyScene = new PIXI.Container();
//     selectScene = new PIXI.Container();
//     gameScene = new PIXI.Container();
//     victoryScene = new PIXI.Container();
//     unlockScene = new PIXI.Container();
//
//     matchScene.visible = true;
//     lobbyScene.visible = false;
//     selectScene.visible = false;
//     gameScene.visible = false;
//     victoryScene.visible = false;
//     unlockScene.visible = false;
//
//     app.stage.addChild(matchScene);
//     app.stage.addChild(lobbyScene);
//     app.stage.addChild(selectScene);
//     app.stage.addChild(gameScene);
//     app.stage.addChild(victoryScene);
//     app.stage.addChild(unlockScene);
//
//     // Match scene setup
//
//     const create = PIXI.Sprite.from('../img/create-button.png');
//     create.scale.set(1.5, 1.5);
//     create.anchor.set(0.5);
//     create.y = -50;
//
//     const join = PIXI.Sprite.from('../img/join-button.png');
//     join.scale.set(1.5, 1.5);
//     join.anchor.set(0.5);
//     join.y = 100;
//
//     matchScene.addChild(create);
//     matchScene.addChild(join);
//
//     matchScene.x = app.screen.width / 2;
//     matchScene.y = app.screen.height / 2;
//     matchScene.pivot.x = matchScene.width / 2;
//     matchScene.pivot.y = matchScene.height / 2;
//
//     create.interactive = true;
//     create.buttonMode = true;
//     join.interactive = true;
//     join.buttonMode = true;
//
//     let input = new PIXI.TextInput({
//         input: {
//             fontFamily: 'Press Start 2P',
//             fontSize: '25px',
//             padding: '15px',
//             width: '450px',
//             color: '#26272E',
//         },
//         box: {
//             default: {fill: 0xE8E9F3, rounded: 12, stroke: {color: 0xCBCEE0, width: 3}},
//             focused: {fill: 0xE1E3EE, rounded: 12, stroke: {color: 0xABAFC6, width: 3}},
//             disabled: {fill: 0xDBDBDB, rounded: 12}
//         }
//     })
//
//     input.placeholder = 'Enter room code';
//     input.y = 220;
//     input.pivot.x = input.width / 2;
//     input.pivot.y = input.height / 2;
//     matchScene.addChild(input);
//
//     // Lobby scene setup
//
//     // if (!lobbyBool) {
//     // window.addEventListener("keydown", readyUp);
//     //     alert("true");
//     // }
//     //
//     // function readyUp(e) {
//     //     if (e.keyCode === 13) {
//     //         alert("ready!!!");
//     //     }
//     // }
//
//     const lobby = PIXI.Sprite.from('../img/lobby-logo.png');
//     lobbyScene.addChild(lobby);
//     lobby.scale.set(1.5, 1.5);
//     lobby.anchor.set(0.5);
//     lobby.y = -350;
//
//     let readyText = new PIXI.Text("PRESS ENTER WHEN READY!");
//     readyText.anchor.set(0.5);
//     readyText.y = 80;
//     readyText.style = new PIXI.TextStyle(({
//         fill: 0x000000,
//         fontSize: 60,
//         fontFamily: 'Press Start 2P',
//         fontStyle: 'bold',
//     }));
//
//     let playerText = new PIXI.Text("Waiting for you...");
//     playerText.anchor.set(0.5);
//     playerText.y = 350;
//     playerText.style = new PIXI.TextStyle(({
//         fill: 0x6F1515,
//         fontSize: 50,
//         fontFamily: 'Press Start 2P',
//         fontStyle: 'bold',
//     }));
//
//     let opponentText = new PIXI.Text("Waiting for your opponent...");
//     opponentText.anchor.set(0.5);
//     opponentText.y = 450;
//     opponentText.style = new PIXI.TextStyle(({
//         fill: 0x6F1515,
//         fontSize: 50,
//         fontFamily: 'Press Start 2P',
//         fontStyle: 'bold',
//     }));
//
//     lobbyScene.addChild(readyText);
//     lobbyScene.addChild(playerText);
//     lobbyScene.addChild(opponentText);
//
//     lobbyScene.x = app.screen.width / 2;
//     lobbyScene.y = app.screen.height / 2;
//
//
//
//     // Select scene setup
//
//     let selectText = new PIXI.Text("Select scene");
//     selectScene.addChild(selectText);
//
//     // Game scene setup
//
//     let gameText = new PIXI.Text("Game scene");
//     gameScene.addChild(gameText);
//
//     // Victory scene setup
//
//     let victoryText = new PIXI.Text("Victory scene");
//     victoryScene.addChild(victoryText);
//
//     // Unlock scene setup
//
//     let unlockText = new PIXI.Text("Unlock scene");
//     unlockScene.addChild(unlockText);
//
//     // Socket code
//
//     let currentRoom = 100000; // default value for no joined room = 100000
//
//     const socket = io();
//     socket.on("connect", () => {
//         console.log(socket.id);
//     });
//
//     socket.on("successful_join", (response) => {
//         console.log(response.msg);
//         currentRoom = response.room;
//         console.log("Stored Room ID: " + currentRoom);
//     });
//
//     create.on('pointerdown', function() {
//         socket.emit("CREATE_ROOM");
//     });
//
//     join.on('pointerdown', function() {
//         socket.emit("JOIN_ROOM", "room1");
//         console.log(document.querySelector("input").value);
//     });
// };
//
//
//
