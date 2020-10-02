/* Setup of user model in DB */
const mongoose = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose');

/* SCHEMA setup */
var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);