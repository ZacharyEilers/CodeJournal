var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user");

//root route
router.get("/", function(req, res){
    res.render("index/landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("index/register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("index/register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/home");
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("index/login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/home",
        failureRedirect: "/login"
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

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;