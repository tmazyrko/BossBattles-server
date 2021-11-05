require("dotenv").config();
// EXAMPLE FOR USING rpcQuery !!!
//const result = await rpc("SELECT * FROM cats;")  // await is necessary so that we wait for the result instead of jumping ahead
//console.error(result);

const express = require("express");
const jwt = require("jsonwebtoken");
const rpc = require("../src/utils/rpcQuery");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

//logic
// Register
app.post("/register", async (req, res) => {
    // Our register logic starts here
    try {
        // Get user input
        const {username, password} = req.body;

        // Validate user input
        if (!(username && password)) {
            res.status(400).send("All fields required");
        }

        // check if user already exist
        // Validate if user exist in our database
        //const oldUser = await User.findOne({ email });
        const oldUserQuery = "SELECT count(*) FROM PlayerInfo WHERE Username = \"" + username + "\";"
        const oldUser = await rpc(oldUserQuery)
        console.log(oldUser)
        if (oldUser > 0) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const createUserQuery = "INSERT INTO PlayerInfo (Username, Pwdhash) VALUES (" + username + ", " + encryptedPassword + ")"
        await rpc(createUserQuery) //const createUser =

        // Create token
        const token = jwt.sign(
            { username: username },
            process.env.TOKEN_KEY,
            {
                expiresIn: "72h",
            }
        );
        // save user token
        //user.token = token;

        // return new user
        //res.status(201).json(user);
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
                process.env.TOKEN_KEY,
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
const auth = require("../src/middleware/auth");
app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome");
});

module.exports = app;