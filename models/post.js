var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
   title: String,
   body: String,
   likes: {type: Number, default: 0},
   totalImpressions: {type: Number, default: 0},
   uniqueImpressions: {type: Number, default: 0},
   hasViewed: [
       {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
       }
   ],
   likedBy:[
       {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
       }
   ],
   created: {type: Date, default: Date.now()},
   author:{
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String,
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
  ]
});

Post = mongoose.model("Post", postSchema);

module.exports = Post;