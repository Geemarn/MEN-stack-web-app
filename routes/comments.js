var express       = require("express"),
	router        = express.Router({mergeParams: true}),
	Comment       = require("../models/comments"),
	Celebrity     = require("../models/celebrities"),
	middlewareObj = require("../middleware");

  /* ==============================  
 NESTED COMMENT INSIDE OF CELEBRITY
  ================================= */
     /////  NEW ROUTE //////
 router.get("/new", middlewareObj.isLoggedin, function(req, res){
 	Celebrity.findById(req.params.id, function(err, foundCeleb){
 		if(err){
 			console.log("cannot find Celebrity");
 		}else {
 			res.render("comment/new", {celeb:foundCeleb});
 		};
 	});
 });
	////// CREATE ROUTE //////
router.post("/", middlewareObj.isLoggedin, function(req, res){
	Celebrity.findById(req.params.id, function(err, foundCeleb){
		if(err){
			console.log("cannot find Celebrity Id");
		}else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log("connot create comment");
				}else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					foundCeleb.comments.push(comment);
					foundCeleb.save();
					req.flash("success", "COMMENT CREATED SUCCESSFULLY");
					res.redirect("/celebrities/" + foundCeleb._id);
				};
			});
		};
	});
});
	///// EDIT ROUTE //////
router.get("/:id2/edit", middlewareObj.checkCommentAuthor, function(req, res){
	Celebrity.findById(req.params.id, function(err, foundCeleb){
		if(err){
			console.log("cannot find Celebrity");
		}else {
			Comment.findById(req.params.id2, function(err, editComment){
				if(err){
					console.log("err");
				}else{
					res.render("comment/edit", {comment: editComment, celeb: foundCeleb});
				};
			});
		};
	});
});
	////UDATE ROUTE ///////
router.put("/:id2", middlewareObj.checkCommentAuthor, function(req, res){
	Comment.findByIdAndUpdate(req.params.id2, req.body.comment, function(err, updatedComment){
		if(err){
			console.log("error again");
			res.redirect("/celebrities");
		}else{
			req.flash("success", "COMMENT EDIT SUCCESSFUL");
			res.redirect("/celebrities/"+ req.params.id);
		};
	});
});
	//////DESTROY ROUTE /////
router.delete("/:id2", middlewareObj.checkCommentAuthor,  function(req,res){
	Comment.findByIdAndRemove(req.params.id2, function(err, deletedComment){
		if(err){
			console.log("errrror");
		}else{
			req.flash("success", "COMMENT DELETED");
			res.redirect("/celebrities/"+ req.params.id);
		};
	});
});

module.exports = router;