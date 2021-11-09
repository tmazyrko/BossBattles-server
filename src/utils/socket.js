
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
        
        socket.on(SOCKET_ACTIONS.JOIN_ROOM, (room) => {  // must make the function async to be able to await rpcQuery !!!
            const currentRooms = io.of('/').adapter.rooms;
            console.log(currentRooms);

            const regex = /^\d{6}$/gm;
            if(regex.test(room)){ // Check that supplied room code is exactly 6 digits
                if(currentRooms.get(room)){ // Check that room exists
                    if(currentRooms.get(room).size < 2){ // Check that room is not full
                        io.in(socket.id).socketsJoin(room);
                        const currentRooms = io.of('/').adapter.rooms;
                        console.log(currentRooms);
                        socket.emit("successful_join", {msg: `You have joined ${room}.`, room});
                        const join = rpc(`UPDATE GameSession SET Player2 = '${players[socket.id]}' WHERE RoomID = '${room}'`);
                    }
                    else{
                        socket.emit("failed_join", {msg: `Room ${room} is full!`, room});
                    }
                }
                else{
                    socket.emit("failed_join", {msg: `Room ${room} does not exist!`, room});
                }
            }
            else{
                socket.emit("failed_join", {msg: `Improper room code format!`});
            }
        });

        socket.on(SOCKET_ACTIONS.CREATE_ROOM, () => { 
            let hasCreatedRoom = false;
            const currentRooms = io.of('/').adapter.rooms;
            let room = 100000;

            do{
                room = Math.floor(100000 + Math.random() * 900000);
               
                if(!currentRooms.get(room)){
                    io.in(socket.id).socketsJoin(room.toString());
                    socket.emit("successful_join", {msg: `you have created and connected to ${room}`, room});
                    console.log(`User ${socket.id} has created and connected to room ${room}`);
                    hasCreatedRoom = true;
                    const session = rpc(`INSERT INTO GameSession VALUES ('${room}', 1, '${players[socket.id]}', 'null', 'Fighter1', 'Fighter2', 100, 100, 0, 0)`);
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

        socket.on(SOCKET_ACTIONS.READY, async(room) => {
            let p = await rpc(`SELECT Player1, Player2, P1Ready, P2Ready FROM GameSession WHERE RoomID = '${room}'`);
            if(players[socket.id] === p.Player1)
            {
                const ready = rpc(`UPDATE GameSession SET P1Ready = 1 WHERE RoomID = '${room}'`);
            }
            if(players[socket.id] === p.Player2)
            {
                const ready = rpc(`UPDATE GameSession SET P2Ready = 1 WHERE RoomID = '${room}'`);
            }
            p = await rpc(`SELECT Player1, Player2, P1Ready, P2Ready FROM GameSession WHERE RoomID = '${room}'`);
            if (p.P1Ready === 1 && p.P2Ready === 1){
                console.log(`Players ready in ${room}`);
                socket.to(room).emit("players_ready", {msg: `Room ${room} is ready!`});
                socket.emit("players_ready", {msg: `Room ${room} is ready!`});
                const reset = rpc(`UPDATE GameSession SET P1Ready = 0, P2Ready = 0 WHERE RoomID = '${room}'`);
            }
        });

        socket.on(SOCKET_ACTIONS.CHARACTER_SUBMIT, async(character, room) => {
            let p = await rpc(`SELECT Player1, Player2, P1Ready, P2Ready, P1Fighter, P2Fighter FROM GameSession WHERE RoomID = '${room}'`);
            let playernum = 0;
            let c;
            if(players[socket.id] === p.Player1)
            {
                playernum = 1;
                const ready = rpc(`UPDATE GameSession SET P1Ready = 1 WHERE RoomID = '${room}'`);
            }
            else if(players[socket.id] === p.Player2)
            {
                playernum = 2;
                const ready = rpc(`UPDATE GameSession SET P2Ready = 1 WHERE RoomID = '${room}'`);
            }
            switch (character) {
                case(1):
                    c = await rpc(`SELECT FighterName FROM FighterInfo WHERE FighterName = 'Jeff Bezos'`);
                    break;
                case(2):
                    c = await rpc(`SELECT FighterName FROM FighterInfo WHERE FighterName = 'Elon Musk'`);
                    break;
                case(3):
                    c = await rpc(`SELECT FighterName FROM FighterInfo WHERE FighterName = 'Mark Zuckerberg'`);
                    break;
                case(4):
                    c = await rpc(`SELECT FighterName FROM FighterInfo WHERE FighterName = 'Tim Cook'`);
                    break;
            }

                console.log(`${players[socket.id]} selected ${c.FighterName}`);
                if (playernum === 1) {
                    const ready = rpc(`UPDATE GameSession SET P1Fighter = '${c.FighterName}' WHERE RoomID = '${room}'`);
                }
                else
                {
                    const ready = rpc(`UPDATE GameSession SET P2Fighter = '${c.FighterName}' WHERE RoomID = '${room}'`);
                }
            p = await rpc(`SELECT Player1, Player2, P1Ready, P2Ready FROM GameSession WHERE RoomID = '${room}'`);
            if (p.P1Ready === 1 && p.P2Ready === 1){
                console.log(`Players have selected characters in ${room}`);
                socket.to(room).emit("select_char", {msg: `Battle ${room} is ready!`});
                socket.emit("select_char", {msg: `Battle ${room} is ready!`});
                const reset = rpc(`UPDATE GameSession SET P1Ready = 0, P2Ready = 0 WHERE RoomID = '${room}'`);
            }
        });

        socket.on(SOCKET_ACTIONS.ATK_SUBMIT, async (chosen_attack, room) => {
            // commit players move to this room's table
            // check if both players have already attacked
            // let clients know move is in progress (on client-side show something to represent that)
            // do game math/code/calculations (querying db, updating db, etc.)
            // send updated info to client - result of moves (new hp, etc.)
            // cont: if the game is over, let the clients know that instead
            // cont: this will let the client update the UI to the victory screen, taking away the old triggers (buttons) and showing new ones to progress through the UI flow

            // IF( WIN CONDITION = TRUE) THEN EMIT TO CLIENT: socket.emit("change_scene_to_victory", {winner: "blah player"});
            let p = await rpc(`SELECT Player1, Player2, P1Ready, P2Ready, P1Fighter, P2Fighter, P1Health, P2Health FROM GameSession WHERE RoomID = '${room}'`);
            let playernum = 0;
            let atk;
            let attack = "nothing";
            let damage = 0;
            let net;
            if(players[socket.id] === p.Player1 && p.P1Ready == 0)
            {
                playernum = 1;
                const ready = rpc(`UPDATE GameSession SET P1Ready = 1 WHERE RoomID = '${room}'`);
                switch (chosen_attack) {
                case(1):
                    atk = await rpc(`SELECT FighterMove1 FROM FighterInfo WHERE FighterName = '${p.P1Fighter}'`);
                    attack = atk.FighterMove1;
                    damage = 25 * (Math.random() * (1.25 - 0.75) + 0.75);
                    damage = Math.round(damage);
                    break;
                case(2):
                    atk = await rpc(`SELECT FighterMove2 FROM FighterInfo WHERE FighterName = '${p.P1Fighter}'`);
                    attack = atk.FighterMove2;
                    damage = 10 * (Math.random() * (4 - 1) + 1);
                    damage = Math.round(damage);
                    break;
                case(3):
                    atk = await rpc(`SELECT FighterMove3 FROM FighterInfo WHERE FighterName = '${p.P1Fighter}'`);
                    attack = atk.FighterMove3;
                    damage = 5 * (Math.random() * (10 - 1) + 1);
                    damage = Math.round(damage);
                    break;
                case(4):
                    atk = await rpc(`SELECT FighterMove4 FROM FighterInfo WHERE FighterName = '${p.P1Fighter}'`);
                    attack = atk.FighterMove4;
                    damage = 20 * (Math.random() * (1.1 - 0.9) + 0.9);
                    damage = Math.round(damage);
                    break;
                }
                p.P2Health -= damage;
            }

            else if(players[socket.id] === p.Player2 && p.P2Ready == 0)
            {
                playernum = 2;
                const ready = rpc(`UPDATE GameSession SET P2Ready = 1 WHERE RoomID = '${room}'`);
                switch (chosen_attack) {
                    case(1):
                        atk = await rpc(`SELECT FighterMove1 FROM FighterInfo WHERE FighterName = '${p.P2Fighter}'`);
                        attack = atk.FighterMove1;
                        damage = 25 * (Math.random() * (1.25 - 0.75) + 0.75);
                        damage = Math.round(damage);
                        break;
                    case(2):
                        atk = await rpc(`SELECT FighterMove2 FROM FighterInfo WHERE FighterName = '${p.P2Fighter}'`);
                        attack = atk.FighterMove2;
                        damage = 10 * (Math.random() * (4 - 1) + 1);
                        damage = Math.round(damage);
                        break;
                    case(3):
                        atk = await rpc(`SELECT FighterMove3 FROM FighterInfo WHERE FighterName = '${p.P2Fighter}'`);
                        attack = atk.FighterMove3;
                        damage = 5 * (Math.random() * (10 - 1) + 1);
                        damage = Math.round(damage);
                        break;
                    case(4):
                        atk = await rpc(`SELECT FighterMove4 FROM FighterInfo WHERE FighterName = '${p.P2Fighter}'`);
                        attack = atk.FighterMove4;
                        damage = 20 * (Math.random() * (1.1 - 0.9) + 0.9);
                        damage = Math.round(damage);
                        break;
                }
                p.P1Health -= damage;
            }
            console.log(`${players[socket.id]} uses ${attack}, dealing ${damage} damage!`);

            if (playernum === 1) {
                const loss = rpc(`UPDATE GameSession SET P2Health = '${p.P2Health}' WHERE RoomID = '${room}'`);
            }
            else if (playernum === 2) {
                const loss = rpc(`UPDATE GameSession SET P1Health = '${p.P1Health}' WHERE RoomID = '${room}'`);
            }
            p = await rpc(`SELECT Player1, Player2, P1Ready, P2Ready FROM GameSession WHERE RoomID = '${room}'`);
            if (p.P1Ready === 1 && p.P2Ready === 1){
                console.log(`Players have each selected their move in ${room}`);
                socket.to(room).emit("battle", {msg: `${players[socket.id]} uses ${attack}, dealing ${damage} damage!`}, p.P1Health, p.P2Health);
                socket.emit("battle", {msg: `${players[socket.id]} uses ${attack}, dealing ${damage} damage!`});
                const reset = rpc(`UPDATE GameSession SET P1Ready = 0, P2Ready = 0 WHERE RoomID = '${room}'`);
            }
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
            console.log("Socket ID - Username List: " + players);
        });

      

    });

    return server;
}
