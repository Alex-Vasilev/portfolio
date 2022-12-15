var crypto = require('crypto')
var User = require('./db/models/user.js')

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
