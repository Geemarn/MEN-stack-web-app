var mongoose = require("mongoose");

var celebritySchema = new mongoose.Schema({
	name:String,
	image:String,
	description:String,
});

module.exports = mongoose.model("Celebrity", celebritySchema);