/**
 * Created by bwbas on 3/23/2017.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('signup');
});

//signup user route
router.post('/signupUser', function(req, res, next){
    console.log("email is " + req.body.email);
});

module.exports = router;
