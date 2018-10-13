var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    errorHandling = require("../errorHandling");
    User        = require("../models/user.js"),
    
//root route
router.get("/", function(req, res){
    res.render("index/landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("index/register", {showCodeInput: false});
});

//REGISTER POST IN ADMIN.JS FILE


//show login form
router.get("/login", function(req, res){
   res.render("index/login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "back",
        failureRedirect: "/login",
        failureFlash: "Your password or username was incorrect",
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/bye");
});

router.get("/bye", function(req, res){
    res.render("index/bye");
});

module.exports = router;