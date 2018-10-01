var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
   body: String,
   created: {type: Date, default: Date.now()},
   author:{
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String,
   }
});

Comment = mongoose.model("Comment", postSchema);

module.exports = Comment;