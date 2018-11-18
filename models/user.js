var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    hasElevatedPermissions: {type: Boolean, default: false},
    //basic, moderator, admin
    permissionType: {type: String, default: "basic"},
    isModerator: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
         }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);