var Post = require("../models/post");
var errorHandling = require("../errorHandling");

//all the middleware goes here

var middlewareObj = {};

middlewareObj.checkPostOwnership = function(req, res, next){
   
   //is the user authenticated?
   if(req.isAuthenticated()){
           
           //if so, find the post we are trying to modify
            Post.findById(req.params.id, function(err, foundPost){
               if (err){
                  errorHandling.databaseError();
                   res.redirect("back");
               } else{
                   //does the user own the campground?
                   if(foundPost.author.id.equals(req.user.id)){
                        next();
                   } else{
                        res.send("you do not have permission to do that");
                   }
               }
            });
           
         //if the user is not authenticated
       } else{
            req.flash("error", "You must be logged in to do that");
            res.redirect("back");
       }
}

// middlewareObj.checkCommentOwnership = function(req, res, next){
   
//    //is the user authenticated?
//    if(req.isAuthenticated()){
           
//            Comment.findById(req.params.comment_id, function(err, foundComment){
//                if (err){
//                    res.redirect("back");
//                } else{
//                    //does the user own the comment?
//                    if(foundComment.author.id.equals(req.user.id)){
//                        next();
//                    } else{
//                        res.redirect("back");
//                    }
//                }
//            });
           
           
//        } else{
//            res.redirect("back");
//        }
// }


middlewareObj.isLoggedIn = function(req, res, next){
   if(req.isAuthenticated()){
       return next();
   }
   //flash must be before the redirect
   req.flash("error", "Please login first");
   res.redirect("/login");
}


module.exports = middlewareObj;