var express = require('express');
var router = express.Router();


router.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/howItWorks', function(req, res, next) {
    res.render('howItWorks');
});

router.get('/pricing', function(req, res, next) {
    res.render('pricing');
});

router.get('/contact', function(req, res, next) {
    res.render('contact');
});

module.exports = router;
