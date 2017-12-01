var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    mobile: {
        type: String
    },
    address: {
        type: String
    },
    token:{
        currentToken: {
            type: String
        },
        expiry:{
            type: String
        }
    },
    status:{
        online: Boolean
    }
}, { collection:'users'});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.token.currentToken=null;
            newUser.status.online=false;
            newUser.save(callback);
        });
    });
};

module.exports.getUserByEmail = function(email, callback){
    var query = {email: email};
    User.findOne(query, callback);
};

module.exports.getUserByToken = function(token, callback){
    var query = {'token.currentToken' : token};
    User.findOne(query, callback);
};


module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err)
            throw err;
        callback(null, isMatch);
    });
};