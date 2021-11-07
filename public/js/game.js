// PixiJS canvas for matchmaking page

const app = new PIXI.Application({
    backgroundColor: 0xffffff,
    width: 1280,
    height: 720,
    resolution: window.devicePixelRatio || 1
});

document.querySelector(".content-ctr").appendChild(app.view);

const container = new PIXI.Container();
app.stage.addChild(container);

const create = PIXI.Sprite.from('../img/create-button.png');
create.scale.set(1.5, 1.5);
create.anchor.set(0.5);
create.y = -50;

const join = PIXI.Sprite.from('../img/join-button.png');
join.scale.set(1.5, 1.5);
join.anchor.set(0.5);
join.y = 100;

container.addChild(create);
container.addChild(join);

container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;

create.interactive = true;
create.buttonMode = true;
join.interactive = true;
join.buttonMode = true;

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
container.addChild(input);

window.onload = function() {

    console.log('loaded')

    let currentRoom = 100000; // default value for no joined room = 100000

    const socket = io();
    socket.on("connect", () => {
        console.log(socket.id);
    });

    socket.on("successful_join", (response) => {
        console.log(response.msg);
        currentRoom = response.room;
        console.log("Stored Room ID: " + currentRoom);
    });

    create.on('pointerdown', function() {
        socket.emit("CREATE_ROOM");
    });

    join.on('pointerdown', function() {
        socket.emit("JOIN_ROOM", "room1");
        console.log(document.querySelector("input").value);
    });
};

// app.renderer.resize(window.innerWidth, window.innerHeight);

