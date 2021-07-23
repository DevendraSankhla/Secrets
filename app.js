//jshint esversion:6
require('dotenv').config()
const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app= express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  username:String,
  password:String
});

const User = mongoose.model("User", userSchema);

const saltRounds = 10;

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash){
    const user = new User({
      username: req.body.username,
      password: hash
    })
    user.save(function(err){
      if(err)
        console.log(err);
      else
        res.render("secrets");
    });
  });
});

app.post("/login", function(req, res){
  User.findOne({username:req.body.username}, function(err, foundUser){
    if(err)
      console.log(err);
    else{
      if(foundUser){
        bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
          if(result)
            res.render("secrets");
          else
            console.log("Incorrect password for the username");
        });
      }
      else
        console.log("User not found");
    }
  });
});

app.listen(3000, function(){
  console.log("server started running");
});
