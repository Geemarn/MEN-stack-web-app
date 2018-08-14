var passportLocalMongoose = require("passport-local-mongoose"),
	methodOverride        = require("method-override"),
	localStrategy         = require("passport-local"),
	bodyParser            = require("body-parser"),
	passport              = require("passport"),
	mongoose              = require("mongoose"),
	flash                 = require("connect-flash"),
	express               = require("express"),
	User                  = require("./models/user"),
	seedDB                = require("./seeds"),
	app                   = express();

// seedDB();

	/// REQUIRING ROUTES ////
var celebrityRoute = require("./routes/celebrities"),
 	commentRoute   = require("./routes/comments"),
	userRoute     =  require("./routes/user");


    //// APP CONFIG ////
mongoose.connect("mongodb://localhost/celebsDB");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/celebrities", express.static("public/celebPics"));
app.use(methodOverride("_method"));
app.use(flash());

   ///// AUTH CONFIG /////
app.use(require("express-session")({
  	secret: "this is my celebrity app",
  	resave: false,
  	saveUninitialized: false
  }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

    //// MIDDLEWARE //////
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.success     = req.flash("success");
	res.locals.error       = req.flash("error");
	next();
});

	///	ROUTER CONFIG ///
app.use(userRoute);
app.use("/celebrities", celebrityRoute);
app.use("/celebrities/:id/comments", commentRoute);

app.listen(3000, "127.0.0.1", () => {
	console.log("server running at port:3000");
});
