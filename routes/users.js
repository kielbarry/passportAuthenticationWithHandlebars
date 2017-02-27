var express 		= require("express")
, router 				= express.Router()
, passport 			= require('passport')
, LocalStrategy = require('passport-local').Strategy
, User 					= require("../models/user.js");

router.get("/register" , function(req, res){
	res.render("register");
});

router.get("/login" , function(req, res){
	res.render("login");
});

router.post("/register" , function(req, res){
	
	var subObj = {};

	subObj.name = req.body.name;
	subObj.email = req.body.email;
	subObj.username = req.body.username;
	subObj.password = req.body.password;

	req.checkBody("name", "Your name is a required field").notEmpty(); 
	req.checkBody("email", "A valid email is required").notEmpty();
	req.checkBody("email", "The email you entered is not valid").isEmail();
	req.checkBody("username", "A username is required").notEmpty(); 
	req.checkBody("password2", "Your passwords don't match!").equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render("register", { errors: errors});
	}

	else {
		var newUser = new User({
			name: subObj.name,
			email: subObj.email,
			password: subObj.username,
			username: subObj.password
		});

		User.createUser(newUser, function(err, user){
			err ? console.log("err:", err) : console.log(user);
		});
		
		req.flash("success_msg", "you are registered and can login");

		res.redirect("/users/login");

	}

});

passport.use(new LocalStrategy(
  function(username, password, done) {
  	User.getUserByUsername(username, function(err, user){
  		if(err) throw err;
  		if(!user) {
  			return done(null, false,{message: "No such user!"});
  		}
  		User.comparePassword(password, user.password, function(err, isMatch){
  			if(err) throw err;
  			if(isMatch) {
  				return done(null, user);
  			}
  			else{
  				return done(null, false, {message: "invalid password!"});
  			}
  		})
  	});
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post("/login", 
	passport.authenticate("local", 
		{
			successRedirect: "/",
			failureRedirect: "/users/login",
			failureFlash: true
		}),
	function(req, res){
		res.redirect("/");
	}
);

router.get("/logout", function(req, res){
	req.logout();
	req.flash("You've been logged out");
	res.redirect("/users/login");
})

module.exports = router; 