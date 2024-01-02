const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBGallery = require("connect-mongodb-session")(session);
const User = require('./userModel');
const bodyParser = require('body-parser');


app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.json());
app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const gallery = new MongoDBGallery({ 
    uri: 'mongodb://127.0.0.1:27017/FinalProject', 
    collection: 'sessiondata' 
}); 

// Session middleware

app.use(session({  
    secret: 'some secret key here',  
    resave: true, 
    saveUninitialized: true,
    loggedIn: false, 
    gallery: gallery,
}));

app.use(function (req, res, next) { 
    console.log(req.session); 
    next(); 
});

app.get("/", async (req, res) => {
    if (req.session.loggedIn) {
        const user = await User.findOne({ _id: req.session.user.id });
        res.render("index", { title: "Home", user: user, notifications: user.notifications });
    } else {
        // Redirect to login only if the request is not already coming from the login route
        if (req.path !== '/login') {
            res.redirect("/login");
        } else {
            res.send("Login page");
        }
    }
});



app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
        }
        res.redirect("/login");
    });
});

//Routes

let authRouter = require("./auth-router");
app.use("/login", authRouter);
let signupRouter = require("./signup-router");
app.use("/signup", signupRouter);
let galleryRouter = require("./gallery-router");
app.use("/gallery", galleryRouter);
let userRouter = require("./user-router");
app.use("/user", userRouter);
let createRouter = require("./createArt-router");
app.use("/create", createRouter);
let notificationRouter = require("./notification-router");
app.use("/notifications", notificationRouter);
let searchRouter = require("./search-router");
app.use("/search", searchRouter);
let artworkRouter = require("./art-router");
app.use("/art", artworkRouter);
let workshopRouter = require("./workshop-router");
app.use("/workshop", workshopRouter);

//404 error handling

app.use((req, res) => {
    res.status(404).send('404 Not Found, Page does not Exist');
  });


//Connect to database and start server
mongoose.connect("mongodb://127.0.0.1/FinalProject", { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function () {
    await mongoose.connection.db.collection("config").replaceOne({ _id: "mainpage" }, {
        _id: "mainpage",
        title: "Welcome to the Gallery",
        description: "This is a gallery of art",
    }, { upsert: true })
        .then(result => {
            app.listen(3000);
            console.log("Server listening on port 3000");
        })
        .catch(err => {
            console.log("Error adding main page config.");
            return;
        });

});

