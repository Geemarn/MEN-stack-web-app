var express = require("express"),
router      = express.Router(),
Comment     = require("../models/comments"),
Celebrity   = require("../models/celebrities");

  /* ==============================  
 NESTED COMMENT INSIDE OF CELEBRITY
  ================================= */
     /////  NEW ROUTE //////
router.get("/celebrities/:id/comments/new", function(req, res){
	Celebrity.findById(req.params.id, function(err, foundCeleb){
		if(err){
			console.log("cannot find Celebrity");
		}else {
			res.render("comment/new", {celeb:foundCeleb});
		};
	});
});
	////// CREATE ROUTE //////
router.post("/celebrities/:id/comments", function(req, res){
	Celebrity.findById(req.params.id, function(err, foundCeleb){
		if(err){
			console.log("connot find Celebrity Id");
		}else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log("connot create comment");
				}else {
					foundCeleb.comments.push(comment);
					foundCeleb.save();
					res.redirect("/celebrities/" + foundCeleb._id);
				};
			});
		};
	});
});







module.exports = router