var mongoose = require("mongoose");

//info in moderatorCodeUrlKey.js

var adminCodeUrlKey = new mongoose.Schema({
    key: String,
    dateCreated: {type: Date, default: Date.now()},
    dateAccessed: Date,
    urlKeyUsedWith: String,
    userWhoUsedKey: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User"
    }
 });

module.exports = mongoose.model("AdminCodeUrlKey", adminCodeUrlKey);