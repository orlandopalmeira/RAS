const mongoose = require('mongoose')
const {version} = require("mongoose");

const passportLocalMongoose = require('passport-local-mongoose');

var usersSchema = new mongoose.Schema({
    username: String,
    password: String,
    numMecanografico: String,
    email: String,
    type: String
}, {versionKey : false});

usersSchema.plugin(passportLocalMongoose, {usernameField: 'email'}); //! NÃO MEXER NESTA LINHA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

module.exports  = mongoose.model('users', usersSchema)