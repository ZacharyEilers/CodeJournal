var mongoose = require("mongoose");

var moderatorCodeSchema = new mongoose.Schema({
   code: String,
   hasBeenUsed: {type: Boolean, default: false},
   dateCreated: {type: String, default: Date.now()},
   dateAccessed: Date,
   urlKeyUsedWith: String,
   userWhoUsedCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
   }
});

module.exports = mongoose.model("ModeratorCode", moderatorCodeSchema);