var Comment     = require("../models/comments"),
    Celebrity   = require("../models/celebrities");


middlewareObj = {};
middlewareObj.isLoggedin = function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	};
	req.flash("error", "OPPS!!..PLEASE LOGIN FIRST");
	res.redirect("/login");
};
	///	TO CHECK IF AUTHOR OWNS COMMENT ////
middlewareObj.checkCommentAuthor = function (req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.id2, function(err, commentAuthor){
			if(err){
				req.flash("error", "CANNOT FIND COMMENT");
				res.redirect("back");
			}else{
				if(req.user._id.equals(commentAuthor.author.id)){
					next();
				}else{
					req.flash("error", "YOU DO NOT HAVE PERMISSION TO DO THIS");
					res.redirect("back")
				}
			}
		})

	}else{
		req.flash("error", "OPPS!!..PLEASE LOGIN FIRST");
		res.redirect("back")
	}
}
	//// CHECK IF USER OWNS A CELEB /////
middlewareObj.checkCelebOwner = function (req, res, next){
	if(req.isAuthenticated()){
		Celebrity.findById(req.params.id, function(err, celebOwner){
			if(err){
				req.flash("error", "CANNOT FIND CELEBRITY DATA");
				res.redirect("back");
			}else{
				if(req.user._id.equals(celebOwner.owner.id)){
					next();
				}else{
					req.flash("error", "YOU DO NOT HAVE PERMISSION TO DO THIS");
					res.redirect("back");
				};
			};
		});
	}else{
		req.flash("error", "OPPS!!..PLEASE LOGIN FIRST");
		res.redirect("back");;
}};
	
module.exports = middlewareObj