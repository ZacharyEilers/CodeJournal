var mongoose = require("mongoose");

//create Url Key
//once key is used in a route call,
//it's accessed date will be set
//after 1 hour the key will no longer work because the code will check to see if
//it is after an hour after the key has been used
//the key will be checked for time limit on page GET and POST,

var moderatorCodeUrlKeySchema = new mongoose.Schema({
   key: String,
   dateCreated: {type: Date, default: Date.now()},
   dateAccessed: Date,
   urlKeyUsedWith: String,
   userWhoUsedKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
   }
});

module.exports = mongoose.model("ModeratorCodeUrlKey", moderatorCodeUrlKeySchema);