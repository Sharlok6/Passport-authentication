const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        requird: true
    },
    email:{
        type:String,
        requird: true
    },
    password:{
        type:String,
        requird: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User',UserSchema);
module.exports = User;