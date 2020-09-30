/* Setup of comment entities in DB */
const mongoose = require('mongoose');

/* SCHEMA setup */
var commentSchema = new mongoose.Schema({
    text: String,
    author: String
  });

  module.exports = mongoose.model('Comment', commentSchema);