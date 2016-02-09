'use strict';
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var User = new mongoose.Schema({
  username: {type: String, unique:true, required: true},
  email: {type: String, unique:true, required: true},
  passwordHash: String,
  passwordSalt: String,
  fullname: [{type: String, required: true}],
  friends: [{type: mongoose.Schema.ObjectId, ref: 'User' }]
});

// This method takes the user's password and hashes it with the crytpo module. This is so that no
// password is stored in cleartext in the database
User.methods.setPassword = function(password){
  this.passwordSalt = crypto.randomBytes(16).toString('hex');
  this.passwordHash = crypto.pbkdf2Sync(password,this.passwordSalt,1000,64).toString('hex');
};

// As there is no means to unhash a string, we need to validate the user's password attempt by
// hashing it and comparing it the the already hashed password 
User.methods.validatePassword = function(password){
  var hashToCheck = crypto.pbkdf2Sync(password,this.passwordSalt,1000,64).toString('hex');
  return hashToCheck === this.passwordHash;
};


// This method generates a JWT with an expiry date 60 days after creation
User.methods.generateJWT = function(){
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

// And the JWT will have the following data MD5 encoded in it
  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime()/1000)
  }, "secret");
};
// process.env.JWT_SECRET
module.exports = mongoose.model('User',User);

