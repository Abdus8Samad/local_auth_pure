const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
        username:String,
        hash:String,
        salt:String,
        email:String,
        avatar:String
})

const User = mongoose.model('user',userSchema);

module.exports = User;