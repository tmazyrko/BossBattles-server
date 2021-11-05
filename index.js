const express = require('express')
const SERVER_PORT = 3000;
const TOKEN_KEY = "039gj0ewg0ju98wgasew0hi9ufWAh9*)FH098WHf(80"


require("dotenv").config();
const jwt = require("jsonwebtoken");
const rpc = require("./src/utils/rpcQuery");
const bcrypt = require("bcrypt");

const app = express(
    [express.urlencoded({ extended: true }),
    express.json()]
);
//const app = express();
//app.use(express.static('public'));
app.use(express.json());


// Enables Socket.IO
const server = require("./src/utils/socket.js")(app);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});


// Register
app.post("/register", async (req, res) => {
    // Our register logic starts here
    try {
        // Get user input
        const {username, password} = req.body;

        // Validate user input
        if (!(username && password)) {
            return res.status(400).send("All fields required");
        }

        // check if user already exist
        // Validate if user exist in our database
        //const oldUser = await User.findOne({ email });
        const oldUserQuery = "SELECT count(*) FROM PlayerInfo WHERE Username = \"" + username + "\";"
        const oldUser = await rpc(oldUserQuery)
        //const oldUserParse = JSON.parse(oldUser);
        console.log(oldUser["count(*)"])

        if (oldUser["count(*)"] > 0) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const createUserQuery = "INSERT INTO PlayerInfo VALUES (\"" + username + "\", 0, \"Elon Musk\", 0, 0, 0, \"" + encryptedPassword + "\"" +");"
        const UserQuery = await rpc(createUserQuery) //const createUser =
        console.log(createUserQuery)

        // Create token
        const token = jwt.sign(
            { username: username },
            TOKEN_KEY,
            {
                expiresIn: "72h",
            }
        );

        res.status(201).json(token);
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

// Login
app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const { username, password } = req.body;

        // Validate user input
        if (!(username && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const userQuery = "SELECT * FROM PlayerInfo WHERE Username = \"" + username + "\";"
        const user = await rpc(userQuery)

        if (user && (await bcrypt.compare(password, user))) {
            // Create token
            // save user token
            const token = jwt.sign(
                { username: username },
                TOKEN_KEY,
                {
                    expiresIn: "72h",
                }
            );

            // user
            res.status(200).json(token);
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

//test auth.js
const auth = require("./src/middleware/auth");
app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome");
});






server.listen(SERVER_PORT, () => {
    console.log(`Server now running at ${SERVER_PORT}`);
});
