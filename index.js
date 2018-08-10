var express         = require("express"),
	bodyParser      = require("body-parser"),
	mongoose        = require("mongoose"),
	methodOverride  = require("method-override"),
	app             = express();

	/// REQUIRING ROUTES ////
var celebrityRoute = require("./routes/celebrities");


    //// APP CONFIG ////
mongoose.connect("mongodb://localhost/celebsDB");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/celebrities", express.static("public/celebPics"));
app.use(methodOverride("_method"));





app.use(celebrityRoute);
app.listen(3000, "127.0.0.1", () => {
	console.log("server running at port:3000");
})
