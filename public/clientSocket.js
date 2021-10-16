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


    document.getElementById("joinRoomButton").addEventListener("click", () => {
        socket.emit("JOIN_ROOM", "room1");
    });

    document.getElementById("createRoomButton").addEventListener("click", () => {
        socket.emit("CREATE_ROOM");
    });

    document.getElementById("leaveRoomButton").addEventListener("click", () => {
        socket.emit("LEAVE_ROOM", currentRoom);
        currentRoom = 100000;
    });

};

