var mongoose = require("mongoose");

var adminCodeSchema = new mongoose.Schema({
   code: String,
   hasBeenUsed: {type: Boolean, default: false},
   dateCreated: {type: Date, default: Date.now()},
   dateAccessed: Date,
   userWhoUsedCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
   }
});

module.exports = mongoose.model("AdminCode", adminCodeSchema);