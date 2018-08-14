var express       = require("express"),
    router        = express.Router(),
    Celebrity     = require("../models/celebrities"),
    middlewareObj = require("../middleware");


    //// INDEX ROUTE ////
router.get("/", function(req, res){
	Celebrity.find({}, function(err, celebs){
		if(err){
			console.log(err);
		}else{
			res.render("celebrity/index", {celebs:celebs});
		}
	})
 });
   //// NEW ROUTE //////
router.get("/new", middlewareObj.isLoggedin, function(req, res){
	res.render("celebrity/new");
}); 
   //// CREATE ROUTE ////  
router.post("/", middlewareObj.isLoggedin, function(req, res){ 
	Celebrity.create(req.body.celeb, function(err, celebs){
			if(err){
				console.log("something happened wrong");
			}else {
				celebs.owner.id = req.user._id;
				celebs.owner.username = req.user.username;
			 	celebs.save();
			 	console.log(celebs.owner.id)
			 	req.flash("success", "CELEBRITY PROFILE CREATE SUCCESSFUL");
			 	res.redirect("/celebrities"); 
			};
	});
});
   //// SHOW ROUTES ///////
router.get("/:id", function(req, res){
	Celebrity.findById(req.params.id).populate("comments").exec(function(err, celeb){
		if(err){
			console.log(err);
		}else{
			res.render("celebrity/show", {celeb: celeb});
		}
	});
});   
	///// EDIT ROUTE //////
router.get("/:id/edit", middlewareObj.checkCelebOwner, function(req, res){
	Celebrity.findById(req.params.id, function(err, editCeleb){
		if(err){
			console.log(err);
		}else{
			res.render("celebrity/edit", {editCeleb: editCeleb});
		};
	});
});
   //// UPDATE ROUTE /////
router.put("/:id", middlewareObj.checkCelebOwner, function(req, res){
	Celebrity.findByIdAndUpdate(req.params.id, req.body.celeb, function(err, editCeleb){
		if(err){
			console.log(err);
		}else{
			req.flash("success", "CELEBRITY PROFILE EDIT SUCCESSFUL");
			res.redirect("/celebrities/"+ req.params.id);
		};
	});
});
   //// DESTROY ROUTE /////
router.delete("/:id", function(req, res){
	Celebrity.findByIdAndRemove(req.params.id, function(err, deletedCeleb){
		if(err){
			console.log(err);
		}else{
			req.flash("success", "CELEBRITY PROFILE DELETED");
			res.redirect("/celebrities");
		};
	});
});


module.exports = router;