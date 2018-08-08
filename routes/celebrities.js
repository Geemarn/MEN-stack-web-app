var express    = require("express"),
    router     = express.Router(),
    Celebrity  = require("../models/celebrities");


    ///LANDING ROUTE ////
router.get("/", function(req, res){
 	res.render("landing");
 })
    //// INDEX ROUTE ////
router.get("/celebrities", function(req, res){
	Celebrity.find({}, function(err, celebs){
		if(err){
			console.log(err);
		}else{
			res.render("index", {celebs:celebs});
		}
	})
 });
   //// NEW ROUTE //////
router.get("/celebrities/new", function(req, res){
	res.render("new");
}); 
   //// CREATE ROUTE ////  
router.post("/celebrities", function(req, res){
	console.log(req.body.name)
	var name = req.body.name;
	var image = req.body.image;
	Celebrity.create({name:name, image:image}, function(err, celebs){
			if(err){
				console.log("something happened wrong");
			}else {
			 	console.log(celebs);
			 	res.redirect("/celebrities"); 
			}
	});
});   

module.exports = router;