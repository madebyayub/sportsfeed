var mongoose = require("mongoose");
    ppLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    followed: [
        {
            sport: String,
            teamname: String
        }
    ]
});
userSchema.plugin(ppLocalMongoose);
module.exports = mongoose.model("User", userSchema);