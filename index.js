const express = require('express')
const SERVER_PORT = 3000;

const app = express(
    [express.urlencoded({ extended: true }),
    express.json()]
);

app.use(express.static('public'));

const rpc = require("./src/utils/rpcQuery.js");
console.log(rpc("SELECT * FROM cats;"));

// Enables Socket.IO
const server = require("./src/utils/socket.js")(app);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});


server.listen(SERVER_PORT, () => {
    console.log(`Server now running at ${SERVER_PORT}`);
});
