const express = require('express')
const SERVER_PORT = 3000;

const app = express(
    [express.urlencoded({ extended: true }),
    express.json()]
);

app.use(express.static('public'));

// Enables Socket.IO
const server = require("./src/utils/socket.js")(app);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});

server.listen(SERVER_PORT, () => {
    console.log(`Server now running at ${SERVER_PORT}`);
});

