var Post = require("../models/post");

//all the middleware goes here

var middlewareObj = {};

// middlewareObj.checkCampgroundOwnership = function(req, res, next){
   
//    //is the user authenticated?
//    if(req.isAuthenticated()){
           
//            Campground.findById(req.params.id, function(err, foundCampground){
//                if (err){
//                    res.redirect("back");
//                } else{
//                    //does the user own the campground?
//                    if(foundCampground.author.id.equals(req.user.id)){
//                        next();
//                    } else{
//                        res.send("you do not have permission to do that");
//                    }
//                }
//            });
           
           
//        } else{
//            res.redirect("back");
//        }
// }

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