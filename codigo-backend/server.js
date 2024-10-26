const express = require("express");
const session = require("express-session");
const cors = require("cors");
const crypto = require('crypto');
const app = express();
const cookieParser = require('cookie-parser');
const mongo_functions = require("./MongoDB.js");
const { mongo } = require("mongoose");

/*
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
*/
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: "123456789",
    resave: true,
    saveUninitialized: true,
}));




app.post("/login", async (req, res) => {
    
    const user = req.body.userName;
    const password = req.body.password;
    //await mongo_functions.addUser(user, password, "d45051ff9f2585fa21d84eb440129656");

    if (user && password) {

        const user_profile = await mongo_functions.findUser(user);
        if (user_profile == null){
            return res.status(400).send('Invalid username or password');
        };

        const salt = user_profile.salt;
        const password_hashed = crypto.createHash("sha256").update(password + salt).digest("hex");
        
        if (password_hashed != user_profile.password){
            return res.status(400).send('Invalid username or password');
        };
        
        req.session.user = user;
        req.session.role = "Admin";

        res.cookie('session_id', req.sessionID, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24,
        });
        return res.status(200).send('Login successful');
    }
    return res.status(400).send('Invalid username or password');
});


app.post("/register", async(req, res) => {
    const user = req.body.userName;
    const password = req.body.password;
    if (user && password){
        const user_profile = await mongo_functions.findUser(user);
        if (user_profile != null){
            return res.status(400).send('Username already exists');
        };
        const salt = crypto.randomBytes(16).toString('hex');
        const password_hashed = crypto.createHash("sha256").update(password + salt).digest("hex");
        mongo_functions.addUser(user, password_hashed, salt);
        req.session.user = user;
        req.session.role = "Admin";

        res.cookie('session_id', req.sessionID, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24,
        });
        res.status(200).send("User added");
    }
    else res.status(400).send("Invalid username or password")
})
app.listen(5000, () => {
    console.log("Server started on port 5000");
});

(async () => {
    try {
        await mongo_functions.connectToDatabase();
        await mongo_functions.initializeDatabase();
        console.log('Database connected and initialitzated successfully');
    } catch (error) {
        console.error('Database connection or initialization failed:', error);
    }
})();


app.get("/dashboard", (req,res) =>{
    const sessionId = req.cookies.session_id; // Get the session_id cookie
    if (sessionId){
        console.log('Session ID:', sessionId);
    }
    else {
        console.log("No SESSION ID")
    }
});
