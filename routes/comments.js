var express = require("express"),
router      = express.Router({mergeParams: true}),
Comment     = require("../models/comments"),
Celebrity   = require("../models/celebrities");

  /* ==============================  
 NESTED COMMENT INSIDE OF CELEBRITY
  ================================= */
     /////  NEW ROUTE //////
router.get("/new", isLoggedin, function(req, res){
	Celebrity.findById(req.params.id, function(err, foundCeleb){
		if(err){
			console.log("cannot find Celebrity");
		}else {
			res.render("comment/new", {celeb:foundCeleb});
		};
	});
});
	////// CREATE ROUTE //////
router.post("/", isLoggedin, function(req, res){
	Celebrity.findById(req.params.id, function(err, foundCeleb){
		if(err){
			console.log("connot find Celebrity Id");
		}else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log("connot create comment");
				}else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					console.log(comment)
					foundCeleb.comments.push(comment);
					foundCeleb.save();
					res.redirect("/celebrities/" + foundCeleb._id);
				};
			});
		};
	});
});

function isLoggedin (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}





module.exports = router