var express     = require("express"),
    router      = express.Router(),
    errorHandling      = require("../errorHandling"),
    middleware  = require("../middleware");

var Post = require("../models/post.js");
var Comment = require("../models/comment.js");
var Journal = require("../models/journal.js");


router.get("/journals/create", middleware.isLoggedIn, function(req, res){
    res.render("journals/create");
});

router.post("/journals/create", middleware.isLoggedIn, function(req, res){
    var title = req.body.title;
    var desc = req.body.description;

    var newJournal = {title: title, description: desc, author:req.user, posts: []};

    Journal.create(newJournal, function(err, createdJournal){
        if (err) {
            errorHandling.databaseError(req);
        } else {
            req.flash("Success! Your journal was created!");
            res.redirect("/home");
        }
    });
});

router.get("/journals", function(req, res){
    req.flash("Your journals are right here!");
    res.redirect("/home");
});

//GET EDIT FORM ROUTE
router.get("/journals/:id/edit", function(req, res){
    Journal.findById(req.params.id, function(err, foundJournal){
        if (err) {
            console.log(err);
            errorHandling.databaseError(req);
        } else {
            res.render("journals/edit", {journal: foundJournal});
        }
    });
});

//UPDATE ROUTE
router.put("/journals/:id", function(req, res){
    Journal.findByIdAndUpdate(req.params.id, {$set: req.body.journal}, {new: true}, function(err, updatedJournal){
        if (err) {
            console.log(err);
            errorHandling.databaseError(req);
        } else {
            req.flash("success", "The Journal "+ updatedJournal.title + " has been successfully updated!");
            res.redirect("/home");
        }
    });
});

router.get("/journals/:id", function(req, res){
    Journal.findById(req.params.id).populate("posts").exec(function(err, foundJournal){
        if (err) {
            console.log(err);
            errorHandling.databaseError(req);
        } else {
            res.render("journals/show", {journal: foundJournal});
        }
    });
});

router.delete("/journals/:id", function(req, res){
    Journal.findById(req.params.id, function(err, foundJournal){
        if (err) {
            console.log(err);
            errorHandling.databaseError(req);
        } else {

            var postsDeleted = 0;

            foundJournal.posts.forEach(function(postID){
                Post.findByIdAndDelete(postID, function(err){
                    if (err) {
                        console.log(err);
                        errorHandling.databaseError(req);
                    } else {
                        postsDeleted++;

                        if(postsDeleted === foundJournal.posts.length){
                            //delete the journal
                            Journal.findByIdAndDelete(req.params.id, function(err){
                                if (err) {
                                    console.log(err);
                                    errorHandling.databaseError(req);
                                } else {
                                    res.redirect("/home");
                                }
                            });
                        }
                    }
                });
            });
        }
    });
});




module.exports = router;