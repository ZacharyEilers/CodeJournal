var express     = require("express"),
    router      = express.Router(),
    errorHandling      = require("../errorHandling"),
    middleware  = require("../middleware");

var Post = require("../models/post.js");
var Comment = require("../models/comment.js");
var Journal = require("../models/journal.js");

var cTable = require('console.table');
var seeds = require("../seeds.js");

var locus = require('locus');



//HOME
router.get("/home", middleware.isLoggedIn, function(req, res){

    console.log("home route hit");


    function showHome(){

        Journal.find({'author.username': req.user.username}, function(err, foundJournals){
            if (err) {
                console.log(err);
                errorHandling.databaseError(req);
            } else {
                console.log("found some journals "+foundJournals.length);
    
                foundJournals.forEach(function(journal){
                    console.log("journal found: "+ journal.title);
                    // eval(require("locus"));
                });
     
                var numUserJournals = foundJournals.length;
    
                var journalsReady = [];
               
                if (foundJournals.length === 0) {
                    res.render("index/home", {journals: journalsReady, noJournals: true});
                } else{
                    foundJournals.forEach(function(journal){
                        Journal.findById(journal._id).populate("posts").exec(function(err, populatedJournal){
                            if (err) {
                                console.log(err);
                                errorHandling.databaseError(req);
                            } else {
                                journalsReady.push(populatedJournal);

                                if(numUserJournals === journalsReady.length){
                                    
                                    //eval(require('locus'));

                                    // journalsReady.forEach(function(journal){
                                    //    for(var i = 0; i<2; i++){
                                    //        console.log("Journal post "+ i + " title " + journal.posts[i].title);
                                    //    }
                                    // });
                                    
                                    //eval(require("locus"));
                                    
                                    res.render("index/home", {journals: journalsReady});
                                } else{
                                    //res.send("INTERNAL SERVER ERROR");
                                }
                            }
                        });
                    });
                }
                
                // Post.find({'author.username': req.user.username}, function(err, foundPosts){
                //     if (err) {
                //         console.log(err);
                //     } else {
                        
                //     }
                // });
    
            }
        });

        console.log("show home executed");

    }

    //seeds.seedDBWithJournalsAndPosts(req, showHome);
    showHome();
    
});

//CREATE POST

//GET CREATE FORM
router.get("/journals/:id/create", middleware.isLoggedIn, function(req, res){
    res.render("posts/create", {id: req.params.id});
});

//POST TO CREATE ROUTE
router.post("/journals/:id/create", middleware.isLoggedIn, function(req, res){
    var title = req.body.title;
    var body = req.sanitize(req.body.body);
    
    var author = {
        id: req.user._id,
        username: req.user.username,
    };
    
    var isPrivate = false;
    
    if(req.body.privacy == "private"){
        isPrivate = true;
    }
    
    // console.log("Codepen URL: "+req.body.codepenUrl);
    
    
    var newPost = {title: title, body: body, author: author, partOfJournal: req.params.id, isPrivate: isPrivate, codepenUrl: req.body.codepenUrl};
    
    
    function updateJournal(newlyCreated){
    //lets update the journal
        Journal.findById(req.params.id, function(err, foundJournal) {
            if (err) {
                console.log(err);
                errorHandling.databaseError(req);
            } else {
            //found the journal
            //lets update it so that it contains this post
            
                foundJournal.posts.push(newlyCreated);
                foundJournal.lastUpdated = Date.now();
            
                Journal.findByIdAndUpdate(req.params.id, foundJournal).populate("posts").exec(function(err, foundJournal){
                   if (err) {
                       console.log(err);
                       errorHandling.databaseError(req);
                   } else {
                       req.flash("success", "Post successfully created: " + title); 
                       res.redirect("/home");
                   }
                });
            }
        });
    }
    
    Post.create(newPost, function(error, newlyCreated){
        if (error){
            console.log(error);
        } else{
            updateJournal(newlyCreated);
        }
    });
});


//SHOW POST

//OPEN POST - SHOW PAGE
router.get("/posts/:id", middleware.authorizeShowPost, function(req, res){
        Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
            if (err) {
                console.log(err);
                errorHandling.databaseError(req)
                res.redirect("/home");
            } else {

                var userHasNotLikedPost = true;

                if (foundPost.likedBy.length > 0) {
                    
                    foundPost.likedBy.forEach(function(user){                        
                        if ((user && req.user) && req.user._id.equals(user._id) ){
                            //set the control boolean to false
                            userHasNotLikedPost = false;
                        }
                    });
                }

                //increment number of impressions on this post,
                //must be before the render() calls

                var newPost = foundPost;

                //increment the number of totalImpressions
                newPost.totalImpressions += 1;

                //if nobody has seen it yet
                if (newPost.hasViewed.length === 0) {

                    //increment the number of unique impressions
                    newPost.uniqueImpressions += 1;

                    //add this user to the hasViewed array
                    newPost.hasViewed.push(req.user);

                //if people have seen it yet
                } else {
                    
                    var userhasNotViewedPost = true;
                    newPost.hasViewed.forEach(function(user){
                           
                            //if I have already liked the post
                            if ((user && req.user) && req.user._id.equals(user._id) ){
                                //set the control boolean to false, the user has viewed the post
                                userhasNotViewedPost = false;
                            }
                        });

                        if(userhasNotViewedPost){
                            //increment the view count
                            newPost.hasViewed.push(req.user);
                            newPost.uniqueImpressions+=1;
                            console.log("unique impression");
                        }
                }

                //update the post
                Post.findByIdAndUpdate(req.params.id, newPost, function(error, updatedPost){
                    if (error) {
                        console.log(error);
                    } else {
                        //continue, and render the show page
                        console.log(newPost.codepenUrl);

                         //if user hasn't liked the post
                        if(userHasNotLikedPost){
                            //show an enabled like button
                            res.render("posts/show", {post: newPost, enabledLikeButton: true});
                        } else{
                            //show an disabled like button
                            res.render("posts/show", {post: newPost, enabledLikeButton: false});
                        }
                        
                    }
                });
            }
        });
});



//SHOW EDIT FORM
router.get("/posts/:id/edit", middleware.checkPostOwnershipForEdit, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if (err) {
            console.log(err);
        } else {
            res.render("posts/edit", {post: foundPost});
        }
    })
    
});

//UPDATE ROUTE
router.put("/posts/:id", middleware.checkPostOwnershipForEdit, function(req, res){
    Post.findOneAndUpdate({_id:req.params.id}, req.body.post, function(err, updatedCampground){
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Post successfully updated");
            res.redirect("/posts/"+req.params.id);
        }
    });
});

//DELETE POST ROUTE
router.delete("/posts/:id", middleware.checkPostOwnershipForDelete, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Post successfully deleted");
            res.redirect("/home");
        }
    })
});

//SHOW EXPLORE ROUTE
router.get("/explore", middleware.isLoggedIn, function(req, res){
    
    if (req.query.search) {
        //TODO: add some sort of ranking algorithm here and clean up the form, maybe create a results page

        const regex  = new RegExp(escapeRegex(req.query.search));

        Post.find({$or:[{title: regex},{body:regex},{'author.username': regex}]}).limit(10).exec(function(err, searchedPosts){
            if (err) {
                console.log(err);
            } else {
                res.render("posts/explore", {posts: searchedPosts, showBackButton: true}); 
            }
        });
    } else {
        //there was no query, just show the page as normal
        Post.find({}).populate("partOfJournal").exec(function(err, foundPosts){
            if (err) {
                console.log(err);
            } else {
                res.render("posts/explore", {posts:foundPosts, showBackButton: false});
            }
        });
    }
});


function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;