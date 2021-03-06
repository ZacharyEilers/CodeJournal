var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override");

var seeds = require("./seeds.js");

seeds.seedDBWithCodes();


//REQUIRING ROUTES
    var postRoutes  = require("./routes/posts.js");
    var indexRoutes = require("./routes/index.js");
    var likeAndCommentRoutes = require("./routes/likesAndComments.js");
    var adminRoutes = require("./routes/admin.js");
    var journalRoutes = require("./routes/journals.js");
    var userRoutes = require("./routes/users.js");


//MODELS
var User = require("./models/user.js");

mongoose.connect("mongodb://localhost/codejournal", {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressSanitizer());


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//res.locals
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   res.locals.info = req.flash("info");
   next();
});




//ROUTES

app.use("/", postRoutes);
app.use("/", indexRoutes);
app.use("/", likeAndCommentRoutes);
app.use("/", adminRoutes);
app.use("/", journalRoutes);
app.use("/", userRoutes);

if (process.env.PORT && process.env.IP){

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Code Journal Server has started on port 3000!!");
    console.log("you're on cloud9");
});

} else{
    app.listen(3000, function(){
        console.log("The Code Journal Server has started on port 3000!");
        console.log("You're on your own computer at home");
    });
}

//TODO:
    //break up the posts.js file into separate files with post CRUD and likes and comments in separate routes

    //add image upload
    //add password reset
    //add admin user account
    //add user profiles
    //add rich text editing for posts and comments

    //async ajax for comments and likes
