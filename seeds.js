var mongoose = require("mongoose");
var AdminCode   = require("./models/adminModeratorModels/adminCode.js"),
    ModeratorCode = require("./models/adminModeratorModels/moderatorCode.js");
    AdminCodeUrlKey = require("./models/adminModeratorModels/adminCodeUrlKey.js"),
    ModeratorCodeUrlKey = require("./models/adminModeratorModels/moderatorCodeUrlKey.js");

var seedsObj = {};

seedsObj.seedDBWithCodes = function (){
    //delete all previous admin codes
    AdminCode.deleteMany({});
    ModeratorCode.deleteMany({});
    AdminCodeUrlKey.deleteMany({});
    ModeratorCodeUrlKey.deleteMany({});

    //create new admin codes
    AdminCodeUrlKey.create({key: "1234567890123456789012345"}, function(err, createdKey){
        if (err) {
            console.log(err);
        } else {
            //console.log("Admin Code Url Key: " + createdKey);

            AdminCode.create({code: "thicc boi", urlKeyUsedWith: createdKey}, function(err, createdCode){
                if (err) {
                    console.log(err);
                } else {
                    //console.log("Admin Code: " + createdCode);
                }
            });

            doModeratorStuff();
        }
    });

    function doModeratorStuff(){
        ModeratorCodeUrlKey.create({key: "123456789012345"}, function(err, createdKey){
            if (err) {
                console.log(err);
            } else {
                //console.log("Moderator Code Url Key: " + createdKey);

                ModeratorCode.create({code: "thiccy", urlKeyUsedWith: createdKey}, function(err, createdCode){
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log("Moderator Code: " + createdCode);
                    }
                });
            }
        });
    }
}



module.exports = seedsObj;