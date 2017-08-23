var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var User = mongoose.Schema({
    username : {
        type: String,
        unique: true,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    
    email :{
            type: String
        }
});
 
module.exports = mongoose.model('User', User);