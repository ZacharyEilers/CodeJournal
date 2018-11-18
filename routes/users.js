var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    errorHandling = require("../errorHandling");

var seeds = require("../seeds.js");

var middleware = require("../middleware");

var User = require("../models/user.js");
var Journal = require("../models/journal.js");


//user show page
router.get("/users/:name", middleware.isLoggedIn, function(req, res){
    User.findOne({username: req.params.name}, function(err, foundUser){
        if (err) {
            console.log(err);
            errorHandling.databaseError(req);
        } else {
            Journal.find({'author.username': req.params.name}, function(err, foundJournals){
                if (err) {
                    console.log(err);
                    errorHandling.databaseError();
                } else {
                    res.render("users/show", {user: foundUser, journals: foundJournals});
                }
            });
        }
    });
});


//user follow route
router.get("/users/:name/follow", middleware.isLoggedIn, function(req, res){
    //find the currently logged in user
    
    //don't let them follow themselves

    if (req.params.name === req.user.username) {
        req.flash("error", "You' can't follow yourself!");
        res.redirect("back");
    } else {

        User.findById(req.user._id).populate("following").exec(function(err, foundUser){
            if (err) {
                console.log(err);
                errorHandling.databaseError(req);
            } else {
                //follow them

                //find the user we want to follow
                User.findOne({username: req.params.name}, function(err, userToFollow){
                    if (err) {
                        errorHandling.databaseError(req);
                    } else {
                        
                        var haveAlreadyFollowed = false;
    
                        //iterate through the following array and find out if we have already followed this person
                        for(var i = 0; i < foundUser.following.length; i++){
                            if (foundUser.following[i].username == userToFollow.username) {
                                //we have already followed this person, so lets not add them again the following array
                                haveAlreadyFollowed = true;
                                break;
                            }
                        }
                       
                        //If the user already followed this person then don't add them to the array again
                        if (haveAlreadyFollowed === false) {
                            foundUser.following.push(userToFollow);
                            User.findByIdAndUpdate(foundUser._id, foundUser, function(err, updatedUser){
                                if (err) {
                                    errorHandling.databaseError(req);
                                } else {
                                    //lets return back to the page
    
                                    //TODO: NEEDED JSON API HERE INSTEAD OF SENDING HTML PAGE
                                    req.flash("success", "You have followed "+userToFollow.username);
                                    res.redirect("back");
                                }
                            });
                        } else{
                            req.flash("error", "You already followed that person");
                            res.redirect("back");
                        }
                    }
                });
            }
        });
        
        
    }
});

router.get("/users/:name/unfollow", middleware.isLoggedIn, function(req, res){
    //get the currently logged in user
    //get the user we want to unfollow
    //remove the user we want to unfollow from the array of followed users, if it exists
    //update the user in the database
    //send back the post show page

    if (req.params.name === req.user.username) {
        req.flash("error", "You can't unfollow yourself!");
        res.redirect("back");
    } else {
        //unfollow them
        User.findById(req.user._id).populate("following").exec(function(err, foundUser){
            if (err) {
                errorHandling.databaseError(req);
            } else {
                //get the user we want to unfollow
                User.findOne({username: req.params.name}, function(err, userToUnfollow){
                    if (err) {
                        errorHandling.databaseError();
                    } else {
                        //remove the user we want to unfollow from the array of followed users
                        for(var i = 0; i < foundUser.following.length; i++){
                            if (foundUser.following[i].username == userToUnfollow.username) {
                                foundUser.following.splice(i, 1);
                            }
                        }
    
                        //update the user in the database
                        User.findByIdAndUpdate(req.user._id, foundUser, function(err, updatedUser){
                            if (err) {
                                errorHandling.databaseError();
                            } else {
                                //AAAND FINALLY RE RENDER THE PAGE.... THE USER SHOW PAGE
                                //NEED JSON API HERE SO BADDDDDLLLLYYYY
                                res.redirect("/users/"+req.params.name);
                            }
                        })
                    }
                });
            }
        });
    }
});

module.exports = router;