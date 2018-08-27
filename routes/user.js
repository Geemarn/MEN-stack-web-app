var express  = require("express"),
	passport = require("passport"),
	router   = express.Router(),
	User     = require("../models/user"),
	Comment  = require("../models/comments"),
	cloudinary    = require('cloudinary'),
    multer        = require('multer'),
	Celebrity     = require("../models/celebrities");

// configure dotenv
require('dotenv').load();
////multer config/////
var storage = multer.diskStorage({
	filename: function(req, file, callback) {
		callback(null, Date.now() + file.originalname);
	}
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|BMP)$/i)) {
    	return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})
/////cloudinar config//////////
cloudinary.config({ 
	cloud_name: 'adegoke',
	api_key: process.env.CLOUDINARY_API_KEY, 
	api_secret: process.env.CLOUDINARY_API_SECRET 
});
///LANDING ROUTE ////
router.get("/", function(req, res){
	res.render("landing");
});
   //// SIGN UP FORM ROUTE////	
   router.get("/register", function(req, res){
   	res.render("register");
   }) 
//// SIGN UP SUBMIT ROUTE ///
router.post("/register", upload.single('image'), function(req, res){
	cloudinary.uploader.upload(req.file.path, function(result) {
		// add cloudinary url for the image to the campground object under image property
		var image = req.body.image;
		var imageId = req.body.imageId;
		var newUser = new User({
			image:result.secure_url,
		  	imageId:result.public_id,
			username: req.body.username,
			firstName:req.body.firstName,
			lastName:req.body.lastName,
			email:req.body.email,
		});
		if(req.body.adminCode === "GMAN1234"){
			newUser.isAdmin = true;
		};
		console.log(newUser)
		User.register(newUser, req.body.password, function(err, user){
			if(err){
				req.flash("error", err.message);
				res.redirect("back");
			};
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "REGISTRATION SUCCESSFUL..WELCOME "+ user.username.toUpperCase());
				res.redirect("/celebrities");
			});
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
	failureFlash: true,
	successFlash: "WELCOME TO CELEBZ PHOTO-BLOG"
}), function(err, loginUser){
});
//// LOGOUT FORM /////
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "LOGOUT SUCCESSFUL");
	res.redirect("/")
});
///USER PROFILE/////
router.get("/user/:id", function(req, res){
User.findById(req.params.id, function(err, foundUser){
	if(err){
		req.flash("error", "User profile cannot be accessed");
		res.redirect("back");
	}else{
		Celebrity.find().where("owner.id").equals(foundUser._id).populate("comments").exec(function(err, celebrities){
			if(err){
				req.flash("error", "something went wrong");
				res.redirect("back");
			}else{
				Comment.find().where("author.id").equals(foundUser._id).exec(function(err, comment){
					if(err){
						req.flash("error", "something went wrong");
						res.redirect("back");
					}else{
						res.render("user/show",{user: foundUser, celebrities: celebrities, comment:comment});
					}
				});
			};
		});
		
	};
});
})
module.exports = router;

