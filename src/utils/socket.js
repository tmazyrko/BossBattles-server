const { createServer } = require("http");
const { Server } = require("socket.io");
const SOCKET_ACTIONS = require("./socketActions");
const rpc = require("./rpcQuery.js");

module.exports = Socket = (httpServer) => {

    const server = createServer(httpServer);
    const io = new Server(server, { /* options */ });
    
    io.on("connection", (socket) => { 
        console.log('New user connected. Socket ID: ' + socket.id);

        
        socket.on(SOCKET_ACTIONS.JOIN_ROOM, async (room) => {
            if(room === "room1"){
                io.in(socket.id).socketsJoin("room1");
                //const result = await rpc("SELECT * FROM cats;")
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

        socket.on("disconnect", (reason) => {
            console.log(`User ${socket.id} has disconnected. Reason: ` + reason)
        });

      

    });

    return server;
}
