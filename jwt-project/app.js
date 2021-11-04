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
    const result = await rpc("SELECT * FROM cats;")
    console.log(result)
    try {
        // Get user input
        const {usern, password} = req.body;

        // Validate user input
        if (!(usern && password) || usern == undefined || password == undefined) {
            res.status(400).send("All fields required");
        }

        // check if user already exist
        // Validate if user exist in our database
        //const oldUser = await User.findOne({ email });
        const oldUserQuery = "SELECT count(*) FROM PlayerInfo WHERE Username = \"" + usern + "\";"
        const oldUser = await rpc(oldUserQuery)
        console.log(oldUser)
        if (oldUser > 0) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const createUserQuery = "INSERT INTO PlayerInfo (Username, Pwdhash) VALUES (" + usern + ", " + encryptedPassword + ")"
        await rpc(createUserQuery) //const createUser =

        // Create token
        const token = jwt.sign(
            { usern: usern },
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
app.post("/login", (req, res) => {
// our login logic goes here
});

//
module.exports = app;