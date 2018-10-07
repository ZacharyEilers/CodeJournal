var mongoose = require("mongoose");

var adminCodeSchema = new mongoose.Schema({
   code: String,
   dateCreated: {type: Date, default: Date.now()},
   dateAccessed: Date,
   urlKeyUsedWith: String,
   userWhoUsedCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
   }
});

module.exports = mongoose.model("AdminCode", adminCodeSchema);