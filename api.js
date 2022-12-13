var mongoose = require('mongoose')
var crypto = require('crypto')
// mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost:27017/usersdb")
var User = require('./db/models/user.js')
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//     console.log('ds')
// });
// User API

exports.createUser = function (userData) { 
    var current = new User({
        username: userData.name,
        email: userData.email,
        password: hash(userData.password),
        role: 'user'
    });

    return current.save();
}

exports.getUser = function (id) {
    return User.findOne(id)
}

exports.checkUser = function (userData) {

    return User
            .findOne({email: userData.email})
            .then(function ({_doc}) {
                if (_doc.password == hash(userData.password)) {
                    console.log("User password is ok");
            
                    return Promise.resolve(_doc)
                } else {
                    return Promise.reject("Error wrong")
                }
            })
}

function hash(text) {
    return crypto.createHash('sha1')
            .update(text).digest('base64')
}
