const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    profile_pic:String,
    name: String,
    bio:String,
    phone:Number,
    email: String,
    password: String
})

const UserModel=mongoose.model('users',Schema);

module.exports={UserModel}