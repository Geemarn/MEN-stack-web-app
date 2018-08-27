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
// configure dotenv
require('dotenv').load();
const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/celebsDB';
mongoose.connect(databaseUri)
		.then(() => console.log(`Database connected`))
		.catch(err => console.log(`Database connection error: ${err.message}`));
// mongoose.connect("mongodb://localhost/celebsDB");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.locals.moment = require("moment");
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


app.listen(process.env.PORT || 3000, process.env.IP, () => {
	console.log("server running at PORT:3000/");
});
