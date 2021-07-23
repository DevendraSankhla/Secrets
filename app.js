//jshint esversion:6
require('dotenv').config()
const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app= express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  username:String,
  password:String
});

userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model("User", userSchema);

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
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })
  user.save(function(err){
    if(err)
      console.log(err);
    else
      res.render("secrets");
  });
});

app.post("/login", function(req, res){
  User.findOne({username:req.body.username}, function(err, foundUser){
    if(err)
      console.log(err);
    else{
      if(foundUser){
        if(foundUser.password == req.body.password)
          res.render("secrets");
        else
          console.log("Incorrect password for the username");
      }
      else
        console.log("User not found");
    }
  });
});

app.listen(3000, function(){
  console.log("server started running");
});
