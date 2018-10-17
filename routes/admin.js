var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    errorHandling = require("../errorHandling"),
    User        = require("../models/user.js"),
    AdminCode   = require("../models/adminModeratorModels/adminCode.js"),
    ModeratorCode = require("../models/adminModeratorModels/moderatorCode.js");


// admin/moderator register form
router.get("/register/admin", function(req, res){
    res.render("index/register", {showCodeInput: true});
});

//handle sign up logic
router.post("/register", function(req, res){

    var newUser = new User({username: req.body.username, hasElevatedPermissions: false, permissionType: "basic"});

    //variable to tell checkCodes function what type of permissions to enable
    var typeOfPermissions;

    //what type of code is this?
    if (req.body.code && req.body.code.length === 25) {
        typeOfPermissions = "admin";
        AdminCode.find({code: req.body.code}, checkCodes);
    } else if(req.body.code && req.body.code.length === 15){
        typeOfPermissions = "moderator";
        ModeratorCode.find({code: req.body.code}, checkCodes);
    } else if(!req.body.code){
        //the code is not present
        typeOfPermissions = "basic";
    }

    function checkCodes(err, foundCode){
        if (err) {
            errorHandling.databaseError(req);
            res.redirect("back");
        } else{ 
            //has the code been used?
           if(!foundCode.hasBeenUsed){

            //well, it has been used now. We will update it in the database later.
            foundCode.hasBeenUsed = true;
            foundCode.userWhoUsedCode = req.user;

            //we will mark that this user has elevated permissions
            newUser.hasElevatedPermissions = true;

                //if so, then what type of permissions should we enable?
                if (typeOfPermissions === "moderator") {
                    newUser.isModerator = true; 
                    newUser.hasElevatedPermissions = true;
                    newUser.permissionType = "moderator";

                    typeOfPermissions = null;

                    ModeratorCode.findByIdAndUpdate(foundCode._id, foundCode, function(err, updatedCode){
                        if (err) {
                            console.log(err);
                            errorHandling.databaseError(req);
                            res.redirect("back");
                        }
                    });

                } else if(typeOfPermissions === "admin"){

                    newUser.isAdmin = true;
                    newUser.hasElevatedPermissions = true;
                    newUser.permissionType = "admin";

                    typeOfPermissions = null;

                    AdminCode.findByIdAndUpdate(foundCode._id, foundCode, function(err, updatedCode){
                        if (err) {
                            console.log(err);
                            errorHandling.databaseError(req);
                            res.redirect("back");
                        }
                    });

                } else{
                    req.flash("error", "Something went wrong");
                    res.redirect("/register/admin");
                }

            } else{
                req.flash("error", "Sorry, that code has already been used");
                res.redirect("/register/admin");
            }

        } 
    }

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        }
        passport.authenticate("local")(req, res, function(){
            if (user.isAdmin) {
                req.flash("info", "You are an Admin!");
            } else if(user.isModerator){
                req.flash("info", "You are a Moderator!");
            }
           res.redirect("/home");
        });
    });
});


module.exports = router;