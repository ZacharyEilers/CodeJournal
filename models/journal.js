var mongoose = require("mongoose");

var journalSchema = new mongoose.Schema({
   title: String,
   description: String,
   topic: String,
   isPrivate: Boolean,
   author: {
       id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
       },
       username: String
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