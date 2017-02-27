require("dotenv").config(); 

const mg 		 = require("mongoose")
, path 						 = require("path")
,	express 				 = require("express")
, http 						 = require("http")
, app 						 = express() 
, PORT 						 = process.env.PORT || 3000
, morgan 					 = require("morgan")
, bodyParser 			 = require("body-parser")
, passport 				 = require("passport")
, Auth0Strategy 	 = require('passport-auth0')
, exphbs 					 = require("express-handlebars")
, expressValidator = require("express-validator")
, flash 					 = require("flash")
, session 				 = require("express-session")
, localStrat 			 = require("passport-local")
, mongo 					 = require("mongodb")
,	db 							 = require("./config/db");

var routes = require("./routes/index.js")
,   users  = require("./routes/users.js");

/**
var db = require("./config/db");
app.use(require("./app/routes.js"));
**/

app.use(morgan("dev"))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended : true }))
  .set("views", path.join(__dirname, "/views"))
  .engine("handlebars", exphbs({defaultLayout: "layout"}))
  .set("view engine", "handlebars")
  .use(express.static(__dirname + "/public"))
  .use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
   
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }))
  .use(flash())
  .use(function(req, res, next){
  	res.locals.sucess_msg = req.flash("sucess_msg");
  	res.locals.error_msg = req.flash("error_msg");
  	res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
  	next();
  })
  .use("/", routes)
  .use("/users", users);


mg.connect(db.url, (e) => e ? console.log(e, "err") : console.log("mgdb connected"));

app.listen(PORT, () => {
	console.log(`You are now listening to ${PORT}, smooth jazz`);
});

exports = module.exports = app;