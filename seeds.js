var mongoose = require("mongoose");
var AdminCode   = require("./models/adminModeratorModels/adminCode.js"),
    ModeratorCode = require("./models/adminModeratorModels/moderatorCode.js");
    
var seedsObj = {};

seedsObj.seedDBWithCodes = function (){
    //delete all previous admin codes

    AdminCode.create({code: "1234567890123456789012345"}, function(err, createdCode){
        if (err) {
            console.log(err);
        } else {
            //console.log("Admin Code: " + createdCode);
        }
    });

    ModeratorCode.create({code: "123456789012345"}, function(err, createdCode){
        if (err) {
            console.log(err);
        } else {
            //console.log("Moderator Code: " + createdCode);
        }
    });
}



module.exports = seedsObj;