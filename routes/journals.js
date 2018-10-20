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




module.exports = router;