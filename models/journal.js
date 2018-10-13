var mongoose = require("mongoose");

var journalSchema = new mongoose.Schema({
   title: String,
   description: String,
   topic: String,
   author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
   },
   followers: [
       {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
       }
   ],
   posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
   ],
   created: {type: Date, default: Date.now()},
});

var Journal = mongoose.model("Journal", journalSchema);

module.exports = Journal;