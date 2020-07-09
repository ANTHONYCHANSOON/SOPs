require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost:27017/SOPsDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
// mongoose.connect("mongodb+srv://admin-anthony:Test123@cluster0-jxcje.mongodb.net/mPlanDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

app.get("/", (req,res)=> {
    res.render("home");
})


let port = process.env.PORT;
if(port == null || port == "") {
    port = 3000;
}

app.listen(port, function() {
    console.log("server started on port = " + port)
})
