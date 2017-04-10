/**
 * Created by bwbas on 3/29/2017.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
    var User = require('../models/user')
    var Essay = require('../models/essay');

    var essays = [];
    //find the user
    User.findById(req.user._id, function (err, user) {
        if (err) return handleError(err);
      console.log(user.uploadedEssayIds);
        //loop through all the essay IDs for this user
       // for( var essayID = 0; essayID< user.uploadedEssayIds.length(); essayID++){
        var ctr=0;
        user.uploadedEssayIds.forEach(function(essayID) {

            //find the essay
            Essay.findById(essayID, function (err, essay) {
                //get the thumbnail
                var google = require('googleapis');
                var drive = google.drive({ version: 'v2', auth: global.myGoogleAuth });

                drive.files.get({ fileId: essay.fileId }, function(err, result) {
                    var thumbnail = result.thumbnailLink;
                    //add essay object to the array
                    essays.push({
                        title: essay.title,
                        thumbnailLink: thumbnail,
                        status: essay.status,
                        date: essay.uploadDate,
                        subject: essay.subject
                    })
                    ctr++;
                    if(ctr == user.uploadedEssayIds.length){
                        console.log(essays[0]);
                        res.render('dash', { title: 'Express' , essayArray: essays});
                    }
                });
            });

        });
    });
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error_msg', 'You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;
