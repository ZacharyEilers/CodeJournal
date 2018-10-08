var flash = require("connect-flash");


var errorHandlingObj = {};

errorHandlingObj.databaseError = function(req){
    req.flash("error", "There was an unexpected database error");
}


module.exports = errorHandlingObj;

