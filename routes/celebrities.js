var express       = require("express"),
    router        = express.Router(),
    Celebrity     = require("../models/celebrities"),
    cloudinary    = require('cloudinary'),
    multer        = require('multer'),
    middlewareObj = require("../middleware");
// configure dotenv
require('dotenv').load();
// Define escapeRegex function for search feature
function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
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
  //// INDEX ROUTE ////
  router.get("/", function(req, res){
  	var noMatch = false;
  	if(req.query.fuzzySearch) {
  		const regex = new RegExp(escapeRegex(req.query.fuzzySearch), 'gi');
  		Celebrity.find({name: regex}, function(err, celebs){
  			if(err){
  				console.log(err);
  			}else{
  				if(celebs.length < 1){
  					var noMatch = true;
  				};
  				res.render("celebrity/index", {celebs:celebs, noMatch: noMatch});
  			};
  		});
  	}else{
  		Celebrity.find({}, function(err, celebs){
  			if(err){
  				console.log(err);
  			}else{
  				res.render("celebrity/index", {celebs:celebs, noMatch: noMatch});
  			};
  		});
  	};
  });
 //// NEW ROUTE //////
 router.get("/new", middlewareObj.isLoggedin, function(req, res){
 	res.render("celebrity/new");
 }); 
 //// CREATE ROUTE ////  
 router.post("/", middlewareObj.isLoggedin, upload.single('image'), function(req, res){ 
 	cloudinary.uploader.upload(req.file.path, function(result) {
// add cloudinary url for the image to the campground object under image property
  req.body.celeb.image = result.secure_url;
  req.body.celeb.imageId = result.public_id;
	  // add owner to celebrity
	  req.body.celeb.owner = {
	  	id: req.user._id,
	  	username: req.user.username
	  }
	  Celebrity.create(req.body.celeb, function(err, celeb) {
	  	if (err) {
	  		req.flash('error', err.message);
	  		return res.redirect('back');
	  	}
	  	req.flash("success", "CELEBRITY PROFILE CREATE SUCCESSFUL");
	  	res.redirect('/celebrities/' + celeb.id);
	  });
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
 router.put("/:id", middlewareObj.checkCelebOwner, upload.single('image'), function(req, res){
 	Celebrity.findById(req.params.id, async function(err, celeb){
 		if(err){
 			req.flash("error", err.message);
 			res.redirect("back");
 		} else {
 			if (req.file) {
 				try {
 					await cloudinary.v2.uploader.destroy(celeb.imageId);
 					var result = await cloudinary.v2.uploader.upload(req.file.path);
 					celeb.imageId = result.public_id;
 					celeb.image = result.secure_url;
 				} catch(err) {
 					req.flash("error", err.message);
 					return res.redirect("back");
 				}
 			}
 			celeb.name = req.body.celeb.name;
 			celeb.description = req.body.celeb.description;
 			celeb.country = req.body.celeb.country;
 			celeb.save();
 			req.flash("success","SUCCESSFULLY UPDATED!");
 			res.redirect("/celebrities/" + celeb._id);
 		}
 	});
 });
 //// DESTROY ROUTE /////
 router.delete("/:id", function(req, res){
 	Celebrity.findById(req.params.id, async function(err, celeb){
 		if(err) {
 			req.flash("error", err.message);
 			return res.redirect("back");
 		}
 		try {
 			await cloudinary.v2.uploader.destroy(celeb.imageId);
 			celeb.remove();
 			req.flash('success', 'CELEBRITY SUCCESSFULLY DELETED!');
 			res.redirect('/celebrities');
 		} catch(err) {
 			if(err) {
 				req.flash("error", err.message);
 				return res.redirect("back");
 			}
 		};
 	});
 });
   module.exports = router;