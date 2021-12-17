// let p2socket;
// socket.on(SOCKET_ACTIONS.READY, async(room) => {
//     let p = await rpc(`SELECT Player1, Player2, P1Ready, P2Ready FROM GameSession WHERE RoomID = '${room}'`);
//     if(players[socket.id] === p.Player1)
//     {
//         const ready = await rpc(`UPDATE GameSession SET P1Ready = 1 WHERE RoomID = '${room}'`);
//         p = await rpc(`SELECT Player1, Player2, P1Ready, P2Ready FROM GameSession WHERE RoomID = '${room}'`);
//         socket.emit("players_ready", {msg: `Room ${room} is ready (socket.emit)`}, p.P1Ready, p.P2Ready);
//     }
//     else if(players[socket.id] === p.Player2)
//     {
//         p2socket = socket.id;
//         const ready = await rpc(`UPDATE GameSession SET P2Ready = 1 WHERE RoomID = '${room}'`);
//         p = await rpc(`SELECT Player1, Player2, P1Ready, P2Ready FROM GameSession WHERE RoomID = '${room}'`);
//         socket.emit("players_ready", {msg: `Room ${room} is ready (socket.emit)`}, p.P1Ready, p.P2Ready);
//     }
//
//     p = await rpc(`SELECT Player1, Player2, P1Ready, P2Ready FROM GameSession WHERE RoomID = '${room}'`);
//     socket.emit("players_ready", {msg: `Room ${room} is ready (socket.emit)`}, p.P1Ready, p.P2Ready);
