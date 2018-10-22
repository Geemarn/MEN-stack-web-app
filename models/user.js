var passportLocalMongoose = require("passport-local-mongoose"),
	mongoose              = require("mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	isAdmin: {type:Boolean, default: false},
	image: String,
	imageId: String,
	firstName: String,
	lastName: String,
	email: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
