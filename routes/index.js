var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
