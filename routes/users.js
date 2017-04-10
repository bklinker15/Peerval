var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Reviewer = require('../models/reviewer');


/* GET users listing. */
//signup
router.get('/signup', function(req, res, next) {
  res.render('signup', {
      errors : null
  });
});

//login
router.get('/login', function(req, res, next) {
    res.render('login', {
        errors : null
    });
});

//register user
router.post('/signup', function(req, res, next) {

    //validation
    req.checkBody('fname', 'First name is required').notEmpty();
    req.checkBody('lname', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Confirm password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    req.checkBody('university', 'University is required').notEmpty();
    req.checkBody('major', 'Major is required').notEmpty();
    req.checkBody('year', 'Class year is required').notEmpty();

    //sanitize
    req.sanitize('fname').trim();
    req.sanitize('lname').trim();
    req.sanitize('email').trim();
    req.sanitize('phone').trim();

    User.find({email: req.body.email}, function(err, docs){
        console.log(docs);
        processUser(req, res, docs)
    });
});

function processUser(req, res, results) {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    var university = req.body.university;
    var major = req.body.major;
    var phone = req.body.phone;
    var year = req.body.year;
    var isReviewer = req.body.isReviewer;
    //TODO add more fields

    var Errors = require('express-validator-errors')

    if(results.length > 0){
        Errors.addToReq(req, 'email', 'Email address is taken', req.body)
    }

    var errors = req.validationErrors();


    if(errors){
        res.render('signup', {
            errors:errors
        });
    }else{
        var newUser = new User({
            fname: fname,
            lname: lname,
            password: password,
            email: email,
            university: university,
            major: major,
            year: year,
            phone: phone,
            isReviewer: isReviewer
        });

        if(newUser.isReviewer){
            Reviewer.createReviewer(newUser._id, function(newReviewer) {
                newUser.reviewerId = newReviewer._id;
            });
        }

        User.createUser(newUser, function() {
            //if (err) throw err;
            //console.log(newUser);

        });


        req.flash('success_msg', 'You are registered and can now login');
        res.redirect('/dash')
    }
}


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
    passport.authenticate('local', {successRedirect: '/dash', failureRedirect:'/users/login', failureFlash: true}),
    function(req, res) {
        res.redirect('/');
    });

router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;
