const { createServer } = require("http");
const { Server } = require("socket.io");
const SOCKET_ACTIONS = require("./socketActions");
const rpc = require("./rpcQuery.js");

module.exports = Socket = (httpServer) => {

    const server = createServer(httpServer);
    const io = new Server(server, { /* options */ });

    let players = [];
    
    io.on("connection", (socket) => {
        console.log('New user connected. Socket ID: ' + socket.id);

        socket.on(SOCKET_ACTIONS.TX_USERNAME, (username) => {
            players[socket.id] = username;
            console.log(players);
        });
        
        socket.on(SOCKET_ACTIONS.JOIN_ROOM, async (room) => {  // must make the function async to be able to await rpcQuery !!!
            if(room === "room1"){
                io.in(socket.id).socketsJoin("room1");

                // EXAMPLE FOR USING rpcQuery !!!
                //const result = await rpc("SELECT count(*) FROM PlayerInfo WHERE Username = \"test\";")  // await is necessary so that we wait for the result instead of jumping ahead
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

        socket.on(SOCKET_ACTIONS.ATK_SUBMIT, async (chosen_attack) => {
            // commit players move to this room's table
            // check if both players have already attacked
            // let clients know move is in progress (on client-side show something to represent that)
            // do game math/code/calculations (querying db, updating db, etc.)
            // send updated info to client - result of moves (new hp, etc.)
            // cont: if the game is over, let the clients know that instead
            // cont: this will let the client update the UI to the victory screen, taking away the old triggers (buttons) and showing new ones to progress through the UI flow

            // IF( WIN CONDITION = TRUE) THEN EMIT TO CLIENT: socket.emit("change_scene_to_victory", {winner: "blah player"});
        });

        socket.on(SOCKET_ACTIONS.VICTORY_CONTINUE, async () => {
            // Check for unlockables here
            // If nothing to unlock, send a command to client to go back to main menu scene
            // If there is something to unlock, send a command to client to go to the unlocks scene
            //Check and see if an unlock happens and how many characters they have unlocked
            //on continue from victory screen
            console.log("ye")
            const numCharUnlockQuery = "SELECT NumCharUnlock FROM PlayerInfo WHERE Username = \"" + players[socket.id] + "\";"
            const numCharUnlock = await rpc(numCharUnlockQuery)
            const userWinsQuery = "SELECT Wins FROM PlayerInfo WHERE Username = \"" + players[socket.id] + "\";"
            const userWins = await rpc(userWinsQuery)
            //console.log(userWins["count(Wins)"] + "user wins");
            console.log(players[socket.id] + " has " + userWins["count(Wins)"] + " wins")
            console.log(userWins)
            if (userWins["Wins"] == 5 && numCharUnlock["NumCharUnlock"] == 0) {
                //socket.emit("successful_join", {msg: `you have unlocked: `})
                const addCharUnlockQuery = "UPDATE PlayerInfo SET NumCharUnlock = " + (numCharUnlock["NumCharUnlock"]+1) + " WHERE Username = \"" + players[socket.id] + "\";"
                const addCharUnlock = await (rpc(addCharUnlockQuery))
                console.log(addCharUnlock)
            }
            if (userWins["Wins"] == 10 && numCharUnlock["NumCharUnlock"] == 1) {
                const addCharUnlockQuery = "UPDATE PlayerInfo SET NumCharUnlock = " + (numCharUnlock["NumCharUnlock"]+1) + " WHERE Username = \"" + players[socket.id] + "\";"
                const addCharUnlock = await (rpc(addCharUnlockQuery))
                console.log(addCharUnlock)
            }
            if (userWins["Wins"] == 15 && numCharUnlock["NumCharUnlock"] == 2) {
                const addCharUnlockQuery = "UPDATE PlayerInfo SET NumCharUnlock = " + (numCharUnlock["NumCharUnlock"]+1) + " WHERE Username = \"" + players[socket.id] + "\";"
                const addCharUnlock = await (rpc(addCharUnlockQuery))
                console.log(addCharUnlock)
            }
            if (userWins["Wins"] == 20 && numCharUnlock["NumCharUnlock"] == 3) {
                const addCharUnlockQuery = "UPDATE PlayerInfo SET NumCharUnlock = " + (numCharUnlock["NumCharUnlock"]+1) + " WHERE Username = \"" + players[socket.id] + "\";"
                const addCharUnlock = await (rpc(addCharUnlockQuery))
                console.log(addCharUnlock)
            }
            // Two possible options here:
            // Keep both players in a room for now and emit/reply specifically to each client's msgs by saving the socket id of sender and using io.sockets.socket(savedSocketId).emit(...)
            // or
            // Break up the room right after the game ends and just respond directly to each client
        });

        socket.on("disconnect", (reason) => {
            console.log(`User ${socket.id} has disconnected. Reason: ` + reason);
            delete players[socket.id];
            console.log(players);
        });

      

    });

    return server;
}
