require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/SOPsDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
// mongoose.connect("mongodb+srv://admin-anthony:Test123@cluster0-jxcje.mongodb.net/SOPsDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    superUser: {
        type: String,
        default: "false"
    },
    dateCreated: {
        type: Date,
        default: Date.now(),

    }
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/dashboard", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("dashboard");
    } else {
        res.redirect("login");
    }
})

app.post("/registerNewUser", function (req, res) {
    console.log(req.body);
    User.register({ username: req.body.username, firstName: req.body.fname, lastName: req.body.lname, superUser: req.body.superUser }, req.body.password, function (err, user) {
        if (err) {
            console.log(err)
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/dashboard");
            })
        }
    })
});

app.post("/login", function (req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    //console.log(user);
    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.render("dashboard", {
                    userinfo : req.user
                })
            })
        }
    })
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log("server started on port = " + port)
})
