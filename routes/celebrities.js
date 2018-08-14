var express    = require("express"),
    router     = express.Router(),
    Celebrity  = require("../models/celebrities");


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
router.get("/new", isLoggedin, function(req, res){
	res.render("celebrity/new");
}); 
   //// CREATE ROUTE ////  
router.post("/", isLoggedin, function(req, res){ 
	Celebrity.create(req.body.celeb, function(err, celebs){
			if(err){
				console.log("something happened wrong");
			}else {
				celebs.owner.id = req.user._id;
				celebs.owner.username = req.user.username;
			 	celebs.save();
			 	console.log(celebs.owner.id)
			 	res.redirect("/celebrities"); 
			}
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

function isLoggedin (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
module.exports = router;