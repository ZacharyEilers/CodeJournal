var express     = require("express"),
    router      = express.Router(),
    errorHandling      = require("../errorHandling"),
    middleware  = require("../middleware");

var Post = require("../models/post.js");
var Comment = require("../models/comment.js");

//LIKE CREATE ROUTE
router.post("/posts/:id/like", middleware.isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if (err) {
            console.log(err);
        } else {
                //found the post
            
                //if there is more than one like
                if (foundPost.likedBy.length > 0) {
                    var userHasNotLikedPost = true;
                    foundPost.likedBy.forEach(function(user){
                        
                            //if I have already liked the post
                            if ((user && req.user) && req.user._id.equals(user._id) ){
                                //set the control boolean to false
                                userHasNotLikedPost = false;
                            }
                        });

                        if(userHasNotLikedPost){
                            //like the post
                            likePost(foundPost);
                            res.redirect("/posts/"+req.params.id);
                        } else{
                            res.redirect("/posts/"+req.params.id);
                        }
                    //if there are 0 likes
                } else {
                    //like the post
                    likePost(foundPost);
                    res.redirect("/posts/"+req.params.id);
                    
                }
           
            }
        });

    function likePost(foundPost){
        //like the post
        foundPost.likes += 1;
        foundPost.likedBy.push(req.user);
            Post.findByIdAndUpdate(req.params.id, foundPost, function(err, updatedPost){
                if (err) {
                    console.log(err);
                } else{
                    //res.redirect("/posts/"+req.params.id);
                }
            });
        }
});

//UNLIKE ROUTE
router.post("/posts/:id/unlike", function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if (err) {
            console.log(err);
        } else {
            var newPost = foundPost;

            //get the index of the user's like in the likedBy array
            var indexOfUserLike = newPost.likedBy.indexOf(req.user);

            //remove that user
            newPost.likedBy.splice(indexOfUserLike, 1);

            //decrement the numberOfLikes property
            newPost.likes -= 1;

            Post.findByIdAndUpdate(req.params.id, newPost, function(err, updatedPost){
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/posts/"+req.params.id);
                }
            });
        }
    });
});


// COMMENT CREATE ROUTE
router.post("/posts/:id/comment", middleware.isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
            res.redirect("/home");
        } else {
         Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                //add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                //save comment
                comment.save();
                foundPost.comments.push(comment);
                foundPost.save();
                res.redirect("/posts/" + req.params.id+"#comments");
            }
         });
        }
    });
});

module.exports = router;