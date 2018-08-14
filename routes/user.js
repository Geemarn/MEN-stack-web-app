var express  = require("express"),
	passport = require("passport"),
	router   = express.Router(),
	User     = require("../models/user");

    ///LANDING ROUTE ////
router.get("/", function(req, res){
 	res.render("landing");
 });

       //// SIGN UP FORM ROUTE////	
router.get("/register", function(req, res){
	res.render("register");
}) 
    //// SIGN UP SUBMIT ROUTE ///
router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		};
		passport.authenticate("local")(req, res, function(){
			res.redirect("/celebrities");
		});
	});
});
	   //// SIGN IN FORM ROUTE ////
router.get("/login", function(req, res){
	res.render("login");
});
   //// SIGN IN SUBMIT ROUTE /// 	
router.post("/login", passport.authenticate("local", {
	successRedirect: "/celebrities",
	failureRedirect: "/login",
}), function(err, loginUser){
});
	//// LOGOUT FORM /////
router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/")
})


module.exports = router;

