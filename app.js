require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

// for encryption and description
const encrypt = require('mongoose-encryption');

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser : true});

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended : true}));

const userSchema = new mongoose.Schema({
  email : String,
  password : String
});

// encrypted using simple string and added which field to encrypt

userSchema.plugin(encrypt, {secret : process.env.SECRET, encryptedFields : ['password']});


const Secret = mongoose.model('Secret', userSchema);


app.get('/', function(req, res){
  res.render('home');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/register', function(req, res){
  res.render('register');
});

app.get('/secrets', function(req, res){
  res.render('secrets');
});

app.get('/submit', function(req, res){
  res.render('submit');
});

app.post('/register', function(req, res){
  const newUser = new Secret({
    email : req.body.username,
    password : req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render('secrets');
    }
  });
});

app.post('/login', function(req, res){
  Secret.findOne({email : req.body.username}, function(err, userfound){
    if(userfound){
      if(userfound.password === req.body.password){
        res.render('secrets');
      }
      else{
        res.send("Wrong password!");
      }
    }
    else{
      res.render('register');
    }
  });
});
app.listen(3000, function(){
  console.log("Server started successfully on port 3000!");
});
