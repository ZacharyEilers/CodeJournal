var Post = require("../models/post");
var errorHandling = require("../errorHandling");

//all the middleware goes here

var middlewareObj = {};

middlewareObj.checkPostOwnershipForEdit = function(req, res, next){
   
   //is the user authenticated?
   if(req.isAuthenticated()){
           
           //if so, find the post we are trying to modify
            Post.findById(req.params.id, function(err, foundPost){
               if (err){
                  errorHandling.databaseError(req);
                   res.redirect("back");
               } else{
                   //does the user own the campground?
                   if(foundPost.author.id.equals(req.user.id) || req.user.isAdmin){
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

middlewareObj.checkPostOwnershipForDelete = function(req, res, next){
   
    //is the user authenticated?
    if(req.isAuthenticated()){
            
            //if so, find the post we are trying to modify
             Post.findById(req.params.id, function(err, foundPost){
                if (err){
                   errorHandling.databaseError(req);
                    res.redirect("back");
                } else{
                    //does the user own the campground?
                    if(foundPost.author.id.equals(req.user.id) || req.user.isModerator || req.user.isAdmin){
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

middlewareObj.authorizeShowPost = function(req, res, next){
    
    if(req.isAuthenticated()){
        //find the post and check if the post is private
        Post.findById(req.params.id, function(err, foundPost) {
           if (err) {
               errorHandling.databaseError(req);
           } else {
               if(foundPost.isPrivate == true){
                   
                   if (foundPost.author.id.equals(req.user.id)) {
                       //let the author of this post view the post
                       return next();
                   } else {
                       //tell the user that this post is private and they can't view it
                       req.flash("The author of this post has marked it as private. You are not authorized to view this post.");
                       res.redirect("back");
                   }
               } else{
                   return next();
               }
           }
        });
    } else{
        req.flash("Please login");
        res.redirect("/login");
    }
}


module.exports = middlewareObj;