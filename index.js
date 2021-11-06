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

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/src/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/src/register.html');
});

app.get('/rooms', (req, res) => {
    res.sendFile(__dirname + '/src/rooms.html');
});

server.listen(SERVER_PORT, () => {
    console.log(`Server now running at ${SERVER_PORT}`);
});