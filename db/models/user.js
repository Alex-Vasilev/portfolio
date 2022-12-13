var mongoose = require('mongoose');

var User = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    email: {
        type: String
    },
    role: {
        type: String
    }
});
 
module.exports = mongoose.model('User', User);