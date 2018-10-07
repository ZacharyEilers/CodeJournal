var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    errorHandling = require("../errorHandling");
    User        = require("../models/user.js"),
    AdminCode   = require("../models/adminModeratorModels/adminCode.js"),
    ModeratorCode = require("../models/adminModeratorModels/moderatorCode.js");
    AdminCodeUrlKey = require("../models/adminModeratorModels/adminCodeUrlKey.js"),
    ModeratorCodeUrlKey = require("../models/adminModeratorModels/moderatorCodeUrlKey.js");

//root route
router.get("/", function(req, res){
    res.render("index/landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("index/register", {showModeratorCodeInput: false, showAdminCodeInput: false, urlKey: null});
});

//check if key exists in database
//check if key is still active (date accessed + 1 hour < Date.now())
//figure out what type of key it is (length: admin=25, moderator=15);
//if doesn't fit length, then send a rejection page, with link to home page and link to creating regular account

//admin/moderator register form
router.get("/register/:key", function(req, res){

    if (req.params.key.length===25) {
        //this a Admin code
        console.log("a admin is trying to sign up");
        AdminCodeUrlKey.findOne({key: req.params.key}, function(err, foundKey){
            
            //if the key hasn't been accessed yet, then set it's dateAccessed property to now
            if (!foundKey.dateAccessed) {
                
            } else {
                req.flash("invalid url key")
                res.redirect("back");
            }

            if (err) {
                console.log(err);
                errorHandling.databaseError();
            } else {
                //the urlKey exists and it has been less than an hour since the url was last accessed,
                //then continue
                if (foundKey && foundKey.dateAccessed + 3600000 > Date.now()) {
                    res.render("index/register", {showAdminCodeInput: true, showModeratorCodeInput: false, urlKey: req.params.key})
                } else {
                    res.send("url key expired");
                }
            }
        });

    } else if(req.params.key.length===15){
        //this is an moderator code
        console.log("a moderator is trying to sign up");

        ModeratorCodeUrlKey.findOne({key: req.params.key}, checkKey);

    } else{
        res.send("invalid url");
    }

    function checkKey(err, foundKey){

        //if the key hasn't been accessed yet or is false, then set it's dateAccessed property to now
        if (!foundKey.hasBeenUsed) {
            foundKey.hasBeenUsed = true;
        } else {
            req.flash("invalid url key")
            res.redirect("back");
        }

        if (err) {
            console.log(err);
            errorHandling.databaseError();
        } else {
            if (foundKey && foundKey.hasBeenUsed) {
                res.render("index/register", {showAdminCodeInput: false, showModeratorCodeInput: true, urlKey: req.params.key});
            } else {
                
                res.send("url key expired");
            }
        }
    }
});

//find code in database
//check if matches url key
//check if code is active
//if so, then its good
//if not, then handle that

//handle sign up logic
router.post("/register", function(req, res){

    var newUser = new User({username: req.body.username});

    //variable to tell checkCodes function what type of permissions to enable
    var typeOfPermissions;

    //if there is a MODERATOR code and no admin code
    if (req.body.moderatorCode && !req.body.adminCode) {
        
        typeOfPermissions = "moderator";

        //find it in the database
        ModeratorCode.findOne({code: req.body.moderatorCode}, checkCodes);
        
    //if there is an ADMIN code and no moderator code
    } else if(!req.body.moderatorCode && req.body.adminCode){

        typeOfPermissions = "admin";

        //find it in the database
        AdminCode.findOne({code: req.body.adminCode}, checkCodes);

        //if there is both somehow
    } else{
        req.flash("No Cheating");
        res.redirect("/home");
    }
    
        function checkCodes(err, foundCode){
            if (err) {
                errorHandling.databaseError();
                res.redirect("back");

                //check if it doesn't match the urlKey
            } else if (foundCode.urlKeyUsedWith != req.body.urlKey){
                req.flash("You gave an invalid code");
                res.redirect("back");

                //else, if it does match the key
            } else if(foundCode.urlKeyUsedWith === req.body.urlKey){

                //if it hasn't been accessed yet
                if(!foundCode.dateAccessed){
                    foundCode.dateAccessed = Date.now();
                    
                    //else, if it has been accessed, then is it active?
                } else if(foundCode.dateAccessed + 3600000 < Date.now()){
                    
                    //if so, then what type of permissions should we enable?
                    if (typeOfPermissions === "moderator") {
                       newUser.isModerator = true; 

                       typeOfPermissions = null;

                    } else if(typeOfPermissions === "admin"){

                        newUser.isAdmin = true;

                        typeOfPermissions = null;

                    } else{
                        req.flash("error", "Something went wrong");
                        res.redirect("/register");
                    }
                }
                
            } 
        }

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
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

module.exports = router;