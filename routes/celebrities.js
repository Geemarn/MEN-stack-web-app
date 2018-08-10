var express    = require("express"),
    router     = express.Router(),
    Celebrity  = require("../models/celebrities");



    ///LANDING ROUTE ////
router.get("/", function(req, res){
 	res.render("celebrity/landing");
 })
    //// INDEX ROUTE ////
router.get("/celebrities", function(req, res){
	Celebrity.find({}, function(err, celebs){
		if(err){
			console.log(err);
		}else{
			res.render("celebrity/index", {celebs:celebs});
		}
	})
 });
   //// NEW ROUTE //////
router.get("/celebrities/new", function(req, res){
	res.render("celebrity/new");
}); 
   //// CREATE ROUTE ////  
router.post("/celebrities", function(req, res){ 
	Celebrity.create(req.body.celeb, function(err, celebs){
			if(err){
				console.log("something happened wrong");
			}else {
			 	console.log(celebs);
			 	res.redirect("/celebrities"); 
			}
	});
});
   //// SHOW ROUTES ///////
router.get("/celebrities/:id", function(req, res){
	Celebrity.findById(req.params.id).populate("comments").exec(function(err, celeb){
		if(err){
			console.log(err);
		}else{
			res.render("celebrity/show", {celeb: celeb});
		}
	});
});   

module.exports = router;