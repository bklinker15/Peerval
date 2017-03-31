var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

/* GET users listing. */
//signup
router.get('/signup', function(req, res, next) {
  res.render('signup');
});

//login
router.get('/login', function(req, res, next) {
    res.render('login');
});

//register user
router.post('/signup', function(req, res, next) {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    //TODO add more fields

    //validation
    req.checkBody('fname', 'First name is required').notEmpty();
    req.checkBody('lname', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Confirm password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors){
        res.render('signup', {
            errors:errors
            //TODO display errors on the page
        });
    }else{
        var newUser = new User({
            fname: fname,
            lname: lname,
            password: password,
            email: email
        });

        User.createUser(newUser, function() {
            //if (err) throw err;
            //console.log(newUser);

        });

        req.flash('success_msg', 'You are registered and can now login');
        res.redirect('/users/login')  //TODO change to home
    }
});

passport.use(new LocalStrategy({
        //tell passport to use email field as a username
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        User.getUserByEmail(email, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, function(err, isMatch){0
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null, false, {message: 'Invalid password'});
                }
            });
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

//Passport authentication
router.post('/login',
    passport.authenticate('local', {successRedirect: '/', failureRedirect:'/users/login', failureFlash: true}),
    function(req, res) {
        res.redirect('/');
    });

router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;
