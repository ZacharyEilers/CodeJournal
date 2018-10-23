var mongoose = require("mongoose");
var AdminCode   = require("./models/adminModeratorModels/adminCode.js"),
    ModeratorCode = require("./models/adminModeratorModels/moderatorCode.js");

var Post = require("./models/post.js");
var faker = require("faker");

var Journal = require("./models/journal.js");
    
var seedsObj = {};

seedsObj.seedDBWithCodes = function (){
    //delete all previous admin codes
    AdminCode.deleteMany({}, function(err){

        if (err) {
            console.log(err);
        } else {
            ModeratorCode.deleteMany({});
        }
    });

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

//just pass in express req object once user is logged in to seed the DB for testing
seedsObj.seedDBWithPosts = function(req, numPosts = 10){

    Post.deleteMany({}, function(err){
        if (err) {
            console.log(err);
        }
    });

    var success = true;

    for(var i = 0; i < numPosts; i++){
        var title = faker.name.title()
        var body = faker.lorem.paragraph();
        
        var author = {
            id: req.user._id,
            username: req.user.username
        };
        
        var newPost = {title: title, body: body, author: author};

        Post.create(newPost, function(error, newlyCreated){
            if (error){
                success = false;
                console.log(error);
            }
        });
    }

    console.log(numPosts + " posts successfully created");
}

seedsObj.seedDBWithJournalsAndPosts = function(req, callback){

    Journal.deleteMany({}, function(err){
        if(err){
            console.log(err);
        } else{

            var title = faker.name.title();
            var desc = faker.lorem.paragraph();

            var author = {
                id: req.user._id,
                username: req.user.username
            };

            var newJournal = {title: title, description: desc, author:req.user, posts: []};

            Journal.create(newJournal, function(err){
                if (err) {
                    console.log(err);
                } else {
                    console.log("Journal created successfully: "+newJournal.title);

                    var newPost = {title: faker.name.title(), body: faker.lorem.paragraph(), author: author}

                    
                        Post.create(newPost, function(err, createdPost){
                            if (err) {
                                console.log(err);
                            } else {
                                newJournal.posts.push(createdPost);
                                
                                Journal.findOneAndUpdate(newJournal._id, newJournal, {new: true}, function(err, updatedJournal){
                                    if (err) {
                                        console.log(err);
                                    } else {     
                                        //eval(require("locus"));
                                        callback();
                                    }
                                });
                            }
                        });

                }
            });

        }
    });

}



module.exports = seedsObj;