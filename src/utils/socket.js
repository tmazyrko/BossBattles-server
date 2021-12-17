
const { createServer } = require("http");
const { Server } = require("socket.io");
const SOCKET_ACTIONS = require("./socketActions");
const rpc = require("./rpcQuery.js");
const axios = require("axios");


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

        let p2socket;
        socket.on(SOCKET_ACTIONS.READY, async(room) => {
            console.log(socket.id);
            let p = await rpc(`SELECT Player1, Player2, P1Ready, P2Ready FROM GameSession WHERE RoomID = '${room}'`);
            if(players[socket.id] == p.Player1)
            {
                const ready = await rpc(`UPDATE GameSession SET P1Ready = 1 WHERE RoomID = '${room}'`);
            }
            else if(players[socket.id] == p.Player2)
            {
                const ready = await rpc(`UPDATE GameSession SET P2Ready = 1 WHERE RoomID = '${room}'`);
            }

            p = await rpc(`SELECT Player1, Player2, P1Ready, P2Ready FROM GameSession WHERE RoomID = '${room}'`);

            if (p.P1Ready == 1 && p.P2Ready == 1){
                let amzn = await rpc(`SELECT CAST(PercentChange AS CHAR) AS PercentChange FROM Stocks WHERE CompanyName = 'AMZN'`);
                let tsla = await rpc(`SELECT CAST(PercentChange AS CHAR) AS PercentChange FROM Stocks WHERE CompanyName = 'TSLA'`);
                let fb = await rpc(`SELECT CAST(PercentChange AS CHAR) AS PercentChange FROM Stocks WHERE CompanyName = 'FB'`);
                let aapl = await rpc(`SELECT CAST(PercentChange AS CHAR) AS PercentChange FROM Stocks WHERE CompanyName = 'AAPL'`);
                console.log(`Players ready in ${room}`);
                //io.in(room).emit("stock_data", amzn.PercentChange, tsla.PercentChange, fb.PercentChange, aapl.PercentChange);
                //socket.emit("stock_data", amzn.PercentChange, tsla.PercentChange, fb.PercentChange, aapl.PercentChange);
                io.in(room).emit("stock_data", amzn.PercentChange, tsla.PercentChange, fb.PercentChange, aapl.PercentChange);
                io.in(room).emit("players_ready", {msg: `Room ${room} is ready!`});
                //socket.emit("players_ready", {msg: `Room ${room} is ready!`});
                const reset = await rpc(`UPDATE GameSession SET P1Ready = 0, P2Ready = 0 WHERE RoomID = '${room}'`);
            }
        });

        let playerChoices = [];
        let p1Moves = [];
        let p2Moves = [];
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

            p = await rpc(`SELECT Player1, Player2, P1Ready, P2Ready, P1Fighter, P2Fighter FROM GameSession WHERE RoomID = '${room}'`);

            if (playernum === 1) {
                const a = await rpc(`SELECT FighterMove1, FighterMove2, FighterMove3, FighterMove4 FROM FighterInfo WHERE FighterName = '${p.P1Fighter}'`);
                p1Moves.push(a.FighterMove1, a.FighterMove2, a.FighterMove3, a.FighterMove4);
                console.log(socket.id);
                io.to(socket.id).emit("show_moves", {msg: `P1 Moves: ${p1Moves}`}, p1Moves);
            }
            else {
                const b = await rpc(`SELECT FighterMove1, FighterMove2, FighterMove3, FighterMove4 FROM FighterInfo WHERE FighterName = '${p.P2Fighter}'`);
                p2Moves.push(b.FighterMove1, b.FighterMove2, b.FighterMove3, b.FighterMove4);
                io.to(socket.id).emit("show_moves", {msg: `P2 Moves: ${p2Moves}`}, p2Moves);
            }

            if (p.P1Ready === 1 && p.P2Ready === 1){
                playerChoices.push(p.P1Fighter);
                playerChoices.push(p.P2Fighter);

                socket.to(room).emit("show_opponent", {msg: `Players are ${playerChoices}`}, playerChoices);
                socket.emit("show_opponent", {msg: `Players chosen are ${playerChoices}`}, playerChoices);

                console.log(`Players have selected characters in ${room}`);
                socket.to(room).emit("select_char", {msg: `Battle ${room} is ready!`});
                socket.emit("select_char", {msg: `Battle ${room} is ready!`});

                const reset = rpc(`UPDATE GameSession SET P1Ready = 0, P2Ready = 0 WHERE RoomID = '${room}'`);
            }
        });

        let winner;
        socket.on(SOCKET_ACTIONS.ATK_SUBMIT, async (chosen_attack, room) => {
            // commit players move to this room's table
            // check if both players have already attacked
            // let clients know move is in progress (on client-side show something to represent that)
            // do game math/code/calculations (querying db, updating db, etc.)
            // send updated info to client - result of moves (new hp, etc.)
            // cont: if the game is over, let the clients know that instead
            // cont: this will let the client update the UI to the victory screen, taking away the old triggers (buttons) and showing new ones to progress through the UI flow

            // IF( WIN CONDITION = TRUE) THEN EMIT TO CLIENT: socket.emit("change_scene_to_victory", {winner: "blah player"});
            let playerHp = [];
            let p = await rpc(`SELECT Player1, Player2, P1Ready, P2Ready, P1Fighter, P2Fighter, P1Health, P2Health FROM GameSession WHERE RoomID = '${room}'`);
            let playernum = 0;
            let atk;
            let attack = "nothing";
            let damage = 0.00;
            let net;
            if(players[socket.id] === p.Player1 && p.P1Ready == 0)
            {
                playernum = 1;
                const ready = await rpc(`UPDATE GameSession SET P1Ready = 1 WHERE RoomID = '${room}'`);
                const atk = await rpc(`SELECT FighterMove1, FighterMove2, FighterMove3, FighterMove4, Stock FROM FighterInfo WHERE FighterName = '${p.P1Fighter}'`);
                let bonusq = await rpc(`SELECT CAST(PercentChange AS CHAR) AS PercentChange FROM Stocks WHERE CompanyName = '${atk.Stock}'`);
                console.log("Bonus " + bonusq.PercentChange)
                let bonus = parseFloat(bonusq.PercentChange);
                switch (chosen_attack) {
                    case(1):
                        attack = atk.FighterMove1;
                        damage = 25 * (Math.random() * (1.25 - 0.75) + 0.75);
                        damage = Math.round(damage);
                        break;
                    case(2):
                        attack = atk.FighterMove2;
                        damage = 10 * (Math.random() * (4 - 1) + 1);
                        damage = Math.round(damage);
                        break;
                    case(3):
                        attack = atk.FighterMove3;
                        damage = 5 * (Math.random() * (10 - 1) + 1);
                        damage = Math.round(damage);
                        break;
                    case(4):
                        attack = atk.FighterMove4;
                        damage = 20 * (Math.random() * (1.1 - 0.9) + 0.9);
                        damage = Math.round(damage);
                        break;
                }
                damage += 5.00 * bonus;
                console.log(bonus);
                console.log(atk.Stock);
                p.P2Health -= damage;
            }

            else if(players[socket.id] === p.Player2 && p.P2Ready == 0)
            {
                playernum = 2;
                const ready = await rpc(`UPDATE GameSession SET P2Ready = 1 WHERE RoomID = '${room}'`);
                const atk = await rpc(`SELECT FighterMove1, FighterMove2, FighterMove3, FighterMove4, Stock FROM FighterInfo WHERE FighterName = '${p.P2Fighter}'`);
                let bonusq = await rpc(`SELECT CAST(PercentChange AS CHAR) AS PercentChange FROM Stocks WHERE CompanyName = '${atk.Stock}'`);
                console.log("Bonus " + bonusq.PercentChange)
                let bonus = parseFloat(bonusq.PercentChange);
                switch (chosen_attack) {
                    case(1):
                        attack = atk.FighterMove1;
                        damage = 25 * (Math.random() * (1.25 - 0.75) + 0.75);
                        damage = Math.round(damage);
                        break;
                    case(2):
                        attack = atk.FighterMove2;
                        damage = 10 * (Math.random() * (4 - 1) + 1);
                        damage = Math.round(damage);
                        break;
                    case(3):
                        attack = atk.FighterMove3;
                        damage = 5 * (Math.random() * (10 - 1) + 1);
                        damage = Math.round(damage);
                        break;
                    case(4):
                        attack = atk.FighterMove4;
                        damage = 20 * (Math.random() * (1.1 - 0.9) + 0.9);
                        damage = Math.round(damage);
                        break;
                }
                damage += 5.00 * bonus;
                console.log(bonus);
                console.log(atk.Stock);
                p.P1Health -= damage;
            }
            console.log(`${players[socket.id]} uses ${attack}, dealing ${damage} damage!`);

            if (playernum === 1) {
                const loss = await rpc(`UPDATE GameSession SET P2Health = '${p.P2Health}' WHERE RoomID = '${room}'`);
            }
            else if (playernum === 2) {
                const loss = await rpc(`UPDATE GameSession SET P1Health = '${p.P1Health}' WHERE RoomID = '${room}'`);
            }

            p = await rpc(`SELECT Player1, Player2, P1Ready, P2Ready, P1Fighter, P2Fighter, P1Health, P2Health FROM GameSession WHERE RoomID = '${room}'`);

            if (p.P1Health > 0 && p.P2Health <= 0) {
                winner = "Player 1";
            }
            else if (p.P2Health > 0 && p.P1Health <= 0) {
                winner = "Player 2";
            }
            else if (p.P1Health <= 0 && p.P2Health <= 0) {
                if (p.P1Health > p.P2Health) {
                    winner = "Player 1";
                }
                else if (p.P1Health < p.P2Health) {
                    winner = "Player 2";
                }
            }
            if (p.P1Ready === 1 && p.P2Ready === 1){
                console.log(`Players have each selected their move in ${room}`);
                playerHp.push(p.P1Health);
                playerHp.push(p.P2Health);

                io.to(room).emit("battle", {msg: `${players[socket.id]} uses ${attack}, dealing ${damage} damage!`}, playerHp);
                io.to(room).emit("combat", {msg: `Combat ye`});

                while(playerHp.length > 0) {
                    playerHp.pop();
                }

                switch (winner) {
                    case("Player 1"):
                        socket.to(room).emit("setup_victory", {msg: "Player 1 wins!"}, "Player 1");
                        socket.emit("setup_victory", {msg: "Player 1 wins!"}, "Player 1");
                        const getp1wins = await rpc(`SELECT Wins, TotalGames FROM PlayerInfo WHERE Username = '${p.Player1}'`);
                        let p1wins = getp1wins.Wins += 1;
                        let p1wmatches = getp1wins.TotalGames += 1;
                        const getp2loss = await rpc(`SELECT Losses, TotalGames FROM PlayerInfo WHERE Username = '${p.Player2}'`);
                        let p2loss = getp2loss.Losses += 1;
                        let p2lmatches = getp2loss.TotalGames += 1;
                        const updatep1win = await rpc(`UPDATE PlayerInfo SET Wins = ${p1wins}, TotalGames = ${p1wmatches} WHERE Username = '${p.Player1}'`);
                        const updatep2loss = await rpc(`UPDATE PlayerInfo SET Losses = ${p2loss}, TotalGames = ${p2lmatches} WHERE Username = '${p.Player2}'`);
                        break;
                    case("Player 2"):
                        socket.to(room).emit("setup_victory", {msg: "Player 2 wins!"}, "Player 2");
                        socket.emit("setup_victory", {msg: "Player 2 wins!"}, "Player 2");
                        const getp2wins = await rpc(`SELECT Wins, TotalGames FROM PlayerInfo WHERE Username = '${p.Player2}'`);
                        let p2wins = getp2wins.Wins += 1;
                        let p2matches = getp2wins.TotalGames += 1;
                        const getp1loss = await rpc(`SELECT Losses, TotalGames FROM PlayerInfo WHERE Username = '${p.Player1}'`);
                        let p1loss = getp1loss.Losses += 1;
                        let p1matches = getp1loss.TotalGames += 1;
                        const updatep2win = await rpc(`UPDATE PlayerInfo SET Wins = ${p2wins}, TotalGames = ${p2matches} WHERE Username = '${p.Player2}'`);
                        const updatep1loss = await rpc(`UPDATE PlayerInfo SET Losses = ${p1loss}, TotalGames = ${p1matches} WHERE Username = '${p.Player1}'`);
                        break;
                }

                const reset = rpc(`UPDATE GameSession SET P1Ready = 0, P2Ready = 0 WHERE RoomID = '${room}'`);
            }
        });

        socket.on(SOCKET_ACTIONS.VICTORY_CONTINUE, async () => {
            // Check for unlockables here
            // If nothing to unlock, send a command to client to go back to main menu scene
            // If there is something to unlock, send a command to client to go to the unlocks scene
            //Check and see if an unlock happens and how many characters they have unlocked
            //on continue from victory screen
            const numCharUnlockQuery = "SELECT NumCharUnlock FROM PlayerInfo WHERE Username = \"" + players[socket.id] + "\";"
            const numCharUnlock = await rpc(numCharUnlockQuery)
            const userWinsQuery = "SELECT Wins FROM PlayerInfo WHERE Username = \"" + players[socket.id] + "\";"
            const userWins = await rpc(userWinsQuery)
            //console.log(userWins["count(Wins)"] + "user wins");
            console.log(players[socket.id] + " has " + userWins.Wins + " wins");
            console.log(userWins);

            if (userWins.Wins < 5) {
                io.to(socket.id).emit("continue", {msg: "Continue..."});
            }

            if (userWins.Wins >= 5 && numCharUnlock.NumCharUnlock === 0) {
                //socket.emit("successful_join", {msg: `you have unlocked: `})
                io.to(socket.id).emit("unlock", {msg: "Unlock!"});
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

        socket.on(SOCKET_ACTIONS.GET_LEADERBOARD, async () => {
            //let playerdata = await rpc(`SELECT Username, Wins, Losses, TotalGames FROM PlayerInfo`);
            let pdata;
            let loading = 1;
            let usercount = 1;
            let lbinfo = '{ "Leaderboard" : [';
            while(loading == 1) {
                pdata = await rpc(`SELECT Username, Wins, Losses, TotalGames FROM PlayerInfo WHERE id = ${usercount}`);
                if (typeof pdata.Username == 'undefined')
                    break;
                if (usercount != 1)
                    lbinfo += ',';
                lbinfo += `{ "Username":"${pdata.Username}" , "Wins":"${pdata.Wins}" , "Losses":"${pdata.Losses}" , "Total Games":"${pdata.TotalGames}" }`;
                usercount ++;
            }
            lbinfo += ']}';
            console.log(lbinfo);

            socket.emit("Leaderboards", lbinfo);

        });

        socket.on("disconnect", (reason) => {
            console.log(`User ${socket.id} has disconnected. Reason: ` + reason);
            delete players[socket.id];
            console.log("Socket ID - Username List: " + players);
        });
        async function stockCheck(ticker){
            let stock = await rpc(`SELECT CompanyName, CAST(Price AS CHAR) AS Price, LastChecked, CAST(PercentChange AS CHAR) AS PercentChange FROM Stocks WHERE CompanyName = '${ticker}'`);
            let date = new Date().getTime() + (1 * 24 * 60 * 60 * 1000);
            if (date > parseInt(stock.LastChecked) + 600000) {  // Only checks if data is older than 10 minutes
                const newStockData = await axios.get(`https://query1.finance.yahoo.com/v6/finance/quote?symbols=${ticker}`);
                const percentChange = newStockData.data.quoteResponse.result[0].regularMarketChangePercent;
                const marketPrice = newStockData.data.quoteResponse.result[0].regularMarketPrice;
                await rpc(`UPDATE Stocks SET LastChecked = '${date}', Price = '${marketPrice}', PercentChange = '${percentChange}' WHERE CompanyName = '${ticker}'`);
                stock = await rpc(`SELECT CompanyName, CAST(Price AS CHAR) AS Price, LastChecked, CAST(PercentChange AS CHAR) AS PercentChange FROM Stocks WHERE CompanyName = '${ticker}'`);
                console.log("Updated data for stock: " + ticker)
                return stock;
            }
            else{
                console.log("Stock data for " + ticker + " updated recently, returning stored data")
                return stock;
            }
        }
        let amznTest = stockCheck('AMZN');
        console.log(amznTest)
        let tslaTest = stockCheck('TSLA');
        console.log(tslaTest)
        let fbTest = stockCheck('FB');
        console.log(fbTest)
        let aaplTest = stockCheck('AAPL');
        console.log(aaplTest)
      

    });

    return server;
}
