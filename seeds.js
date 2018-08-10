var mongoose    = require("mongoose"),
    Celebrity   = require("./models/celebrities"),
    Comment     = require("./models/comments");

celebArray = [
 	{name: "alicia keys", image: "Alicia Keyes.jpg", description: "i love alicia"},
 	{name: "beyonce", image: "Beyonce Beauty.jpg", description: "i love beyonce"},
 	{name: "amber-heard", image: "amber-heard.jpg", description: "i love amber-heard"},
 	{name: "Britany Spear", image: "Britany Spear.jpg", description: "i love Britany Spear"},
 	{name: "kim kardershian", image: "Copy of kim.jpg", description: "i love kim kardershian"},
 	{name: "amber rose", image: "amber-rose-south-beach.jpg", description: "i love amber rose"}
 ]

function seedDB(){
	Celebrity.remove({}, function(err, deleteCelebs){
		if(err){
			console.log("cannot remove file");
		}else{
			console.log("celebrities removed");
		}
	},
	celebArray.forEach(function(celeb){
		Celebrity.create(celeb, function(err, celeb){
			if(err){
				console.log("cannot create Celebrity");
			}else{
				console.log("Celebrity added");
				Comment.create({
					text: "this girls are juzt adorable and elegent",
					author: "Adorable girls"
				}, function(err, comment){
					if(err){
						console.log("connot create comment");
					}else {
						celeb.comments.push(comment)
						celeb.save(function(err, savedCeleb){
							if(err){
								console.log("connot save Celebrity")
							}else{
								console.log("Celebrity saved")
							}
						})
					}
				})
			}
		})
	})
	);
};
module.exports = seedDB;