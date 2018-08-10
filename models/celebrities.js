var mongoose = require("mongoose");

var celebritySchema = new mongoose.Schema({
	name:String,
	image:String,
	description:String,
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}],
});

module.exports = mongoose.model("Celebrity", celebritySchema);