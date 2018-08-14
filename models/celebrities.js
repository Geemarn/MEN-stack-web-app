var mongoose = require("mongoose");

var celebritySchema = new mongoose.Schema({
	name:String,
	image:String,
	description:String,
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}],
	owner: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String
	}
});

module.exports = mongoose.model("Celebrity", celebritySchema);