var Comment     = require("../models/comments"),
    Celebrity   = require("../models/celebrities");

    
middlewareObj = {};
middlewareObj.isLoggedin = function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};
	///	TO CHECK IF AUTHOR OWNS COMMENT ////
middlewareObj.checkCommentAuthor = function (req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.id2, function(err, commentAuthor){
			if(err){
				console.log("wooop");
				res.redirect("back");
			}else{
				if(req.user._id.equals(commentAuthor.author.id)){
					next();
				}else{
					res.redirect("back")
				}
			}
		})

	}else{
		res.redirect("back")
	}
}
	//// CHECK IF USER OWNS A CELEB /////
middlewareObj.checkCelebOwner = function (req, res, next){
	if(req.isAuthenticated()){
		Celebrity.findById(req.params.id, function(err, celebOwner){
			if(err){
				res.redirect("back");
			}else{
				if(req.user._id.equals(celebOwner.owner.id)){
					next();
				}else{
					console.log("back back")
					res.redirect("back");
				};
			};
		});
	}else{
		console.log("back")
		res.redirect("back");;
}};
	
module.exports = middlewareObj