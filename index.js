require('dotenv').config()
const express = require('express');
const sessions = require('express-session');
const MemoryStore = require('memorystore')(sessions); // Prod-ready server memory storage for sessions
const rpc = require("./src/utils/rpcQuery"); // Used to query DB, must be called with await within an async function!!
const argon2 = require('argon2');

const app = express(
    [express.urlencoded({ extended: true }),
    express.json()]
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (css, js, etc.)
app.use(express.static('public'));

// Set up Express sessions middleware
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized:true,
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired sessions from server every 24h
    }),
    cookie: { maxAge: oneDay },
    resave: false
}));

// Enables Socket.IO
const server = require("./src/utils/socket.js")(app);

// Define authentication middleware
const sessionAuth = require("./src/middleware/sessionAuth.js");

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});

app.get('/game', sessionAuth, (req, res) => {  // Requires sessionAuth middleware to authenticate
    res.sendFile(__dirname + '/src/game.html');
});

app.use('/game', function(err, req, res, next){
    console.log(err);
    //User should be authenticated! Redirect him to log in.
    res.redirect('/login');
});

app.get('/logout', function(req, res){
    req.session.destroy(function(){
        console.log("User logged out.")
    });
    res.redirect('/');
});

// Registration
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/src/register.html');
});

app.post('/register', async function(req, res){
    // Our register logic starts here
    try {
        // Get user input
        const username = req.body.username;
        const password = req.body.password;

        // Validate user input
        if (!(username && password)) {
            return res.status(400).send("All fields required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUserQuery = "SELECT count(*) FROM PlayerInfo WHERE Username = \"" + username + "\";"
        const oldUser = await rpc(oldUserQuery)
        console.log(oldUser["count(*)"])

        if (oldUser["count(*)"] > 0) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        const encryptedPassword = await argon2.hash(password, 10)

        // Create user in our database
        const createUserQuery = "INSERT INTO PlayerInfo VALUES (\"" + username + "\", 0, \"Elon Musk\", 0, 0, 0, \"" + encryptedPassword + "\"" + ", 0);"
        await rpc(createUserQuery)

        const newUser = {id: username, password: password};
        req.session.user = newUser;
        res.redirect('/game');

    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

// Login
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/src/login.html');
});

app.post('/login', async function(req, res){
    // Our login logic starts here
    try {
        // Get user input
        const username = req.body.username;
        const password = req.body.password;

        // Validate user input
        if (!(username && password)) {
            return res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const userQuery = "SELECT Pwdhash FROM PlayerInfo WHERE Username = \"" + username + "\";"
        const user = await rpc(userQuery)
        //await bcrypt.compare(password.toString(), user["Pwdhash"].toString())
        if (user["Pwdhash"] !== undefined && (await argon2.verify(user["Pwdhash"].toString(), password.toString()))) {
            req.session.user = {id: username, password: password};
            return res.redirect('/game');
        }
        return res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
    // Our login logic ends here
});

// Leaderboard
app.get('/leaderboard', (req, res) => {
    res.sendFile(__dirname + '/src/leaderboard.html');
});

// Start Express server
server.listen(process.env.SERVER_PORT, () => {
    console.log(`Server now running at ${process.env.SERVER_PORT}`);
});
