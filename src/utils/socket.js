const { createServer } = require("http");
const { Server } = require("socket.io");
const SOCKET_ACTIONS = require("./socketActions");
const rpc = require("./rpcQuery.js");

module.exports = Socket = (httpServer) => {

    const server = createServer(httpServer);
    const io = new Server(server, { /* options */ });
    
    io.on("connection", (socket) => { 
        console.log('New user connected. Socket ID: ' + socket.id);

        
        socket.on(SOCKET_ACTIONS.JOIN_ROOM, async (room) => {  // must make the function async to be able to await rpcQuery !!!
            if(room === "room1"){
                io.in(socket.id).socketsJoin("room1");

                // EXAMPLE FOR USING rpcQuery !!!
                //const result = await rpc("SELECT * FROM cats;")  // await is necessary so that we wait for the result instead of jumping ahead
                //console.error(result);

                socket.emit("successful_join", {msg: `you have joined ${room}`, room});
            }
        });

        socket.on(SOCKET_ACTIONS.CREATE_ROOM, () => { 
            let hasCreatedRoom = false;
            const currentRooms = io.of('/').adapter.rooms;
            let room = 100000;

            do{
                room = Math.floor(100000 + Math.random() * 900000);
               
                if(!currentRooms.get(room)){
                    io.in(socket.id).socketsJoin(room);
                    socket.emit("successful_join", {msg: `you have created and connected to ${room}`, room});
                    console.log(`User ${socket.id} has created and connected to room ${room}`);
                    hasCreatedRoom = true;
                }
            }while(!hasCreatedRoom);
        });

        // Note: need to cover edge case, in case the room given does not actually contain socket
        socket.on(SOCKET_ACTIONS.LEAVE_ROOM, (room) => {
            console.log(io.of("/").adapter.rooms)
            io.in(socket.id).socketsLeave(room);
            console.log(`User ${socket.id} has left room ${room}`);
            console.log(io.of("/").adapter.rooms)
        });

        //socket.on(SOCKET_ACTIONS.ATTACK, async (chosen_attack) => {
            // commit players move to this room's table
            // check if both players have already attacked
            // let clients know move is in progress (on client-side show something to represent that)
            // do game math/code/calculations (querying db, updating db, etc.)
            // send updated info to client - result of moves (new hp, etc.)
            // cont: if the game is over, let the clients know that instead
            // cont: this will let the client update the UI to the victory screen, taking away the old triggers (buttons) and showing new ones to progress through the UI flow
        //});

        socket.on("disconnect", (reason) => {
            console.log(`User ${socket.id} has disconnected. Reason: ` + reason)
        });

      

    });

    return server;
}
