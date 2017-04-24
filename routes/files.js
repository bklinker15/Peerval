var express = require('express');
var router = express.Router();
var Essay = require('../models/essay');
var User = require('../models/user')
router.post('/uploadFile', function(req, res, next) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    var fs = require('fs');
    var google = require('googleapis');
    var drive = google.drive({ version: 'v3', auth: global.myGoogleAuth });
    var streamifier = require('streamifier');

    drive.files.create({
        resource: {
            name: req.user.fname + "_" + req.user.lname + "_" + req.body.essayName,
            mimeType: 'application/vnd.google-apps.document'
        },
        media: {
            mimeType: 'application/msword',
            body: streamifier.createReadStream(req.files.file.data)
        }
    }, function(err, file) {
        if(err) {
            // Handle error
            console.log(err);
        } else {
            var drive = google.drive({ version: 'v2', auth: global.myGoogleAuth });
            //console.log(file)
            drive.files.get({ fileId: file.id }, function (err, result){
                if(err) {
                    // Handle error
                    console.log(err);
                } else {
                    // console.log("Result");
                    // console.log(result);
                    var newEssay = new Essay({
                        authorEmail: req.user.email,
                        authorId: req.user._id,
                        fileId: result.id,
                        status: "Not_Reviewed",
                        thumbnailLink: "",
                        GDalternateLink: result.alternateLink,
                        priority: req.body.priority,
                        reviewerId: "",
                        uploadDate: new Date(),

                        dueDate: new Date(req.body.date),
                        prompt: req.body.prompt,
                        pageLength: req.body.pageLength,
                        topic: req.body.topic,
                        classPrefix: req.body.classPrefix,
                        classLevel: req.body.classNumber,
                        title: req.body.essayName,
                        rewardAmt: req.body.reward
                    });
                    newEssay.save();
                    console.log(newEssay._id);

                    User.findById(req.user._id, function (err, user) {
                        if (err) return handleError(err);

                        user.uploadedEssayIds.push(newEssay._id);
                        user.save(function (err, updatedUser) {
                            if (err) console.log(err);
                        });
                    });
                }
            });


            req.flash('success_msg', 'File uploaded!');
            res.redirect('/dash')
        }
    });
});

router.get('/downloadFile', function(req, res, next){
    var google = require('googleapis');
    var drive = google.drive({ version: 'v2', auth: global.myGoogleAuth });
    var fileId = req.query.fileId;
    var downloadLink = 'https://docs.google.com/feeds/download/documents/export/Export?id='+fileId+'&exportFormat=docx';
    //provide temporary permissions to the user
    drive.permissions.insert({
        'fileId': fileId,
        'resource': {
            "role": "reader",
            "type": "anyone",   //can change to a specific user
            "additionalRoles": [
                "commenter"
            ]
        }
    }, function (err, resp, body) {
            if (err) {
                // Handle error
                console.log(err);
            }
            else {
                res.redirect(downloadLink); //download the file
                //delete permissions
                drive.permissions.delete({
                    'fileId': fileId,
                    'permissionId': 'anyone'
                })
            }
        }
    );
});


router.get("/acceptReview", function(req, res, next){
    var google = require('googleapis');
    var drive = google.drive({ version: 'v2', auth: global.myGoogleAuth });
    var fileId = req.query.fileId;
    var id = req.query.id;
    var reviewLink = 'https://docs.google.com/document/d/' + fileId + '/edit?usp=drivesdk';

    //mark essay as in progress
    Essay.markEssayInProgress(id, function(err, doc){
        if(err){
            res.send("Unable to review essay.  This essay may already be claimed by another reviewer or taken down by the uploader");
        }else{
            //provide temporary permissions to the user
            drive.permissions.insert({
                    'fileId': fileId,
                    'resource': {
                        "role": "reader",
                        "type": "anyone",   //can change to a specific user
                        "additionalRoles": [
                            "commenter"
                        ]
                    }
                }, function (err, resp, body) {
                    if (err) {
                        // Handle error
                        console.log(err);
                    }
                    else {
                        res.redirect(reviewLink); //view file

                        //delete permissions
                        // drive.permissions.delete({
                        //     'fileId': fileId,
                        //     'permissionId': 'anyone'
                        // })
                    }
                }
            );
        }
    });

});




//AJAX endpoint for get reviewable essays for table
router.post("/getSearchResults", function(req, res, next) {
    Essay.getReviewableEssaysByTopic(req.user._id, function(err, reviewableEssays){
        var essays = [];
        reviewableEssays.forEach(function(essay) {
            essays.push({
                id: essay._id,
                fileId: essay.fileId,
                title: essay.title,
                prompt: essay.prompt,
                status: essay.status,
                GDalternateLink: essay.GDalternateLink,
                priority: essay.priority,
                uploadDate: essay.uploadDate,
                dueDate: essay.dueDate,
                topic: essay.topic,
                classPrefix: essay.classPrefix,
                classLevel: essay.classLevel,
                rewardAmt: essay.rewardAmt, //TODO: calc reward amount w formula
                wordCount: essay.wordCount
            })
        });

        //sends essays to client
        res.send(essays);
    });
});

router.post("/submitReview", function(req, res, next) {
    var id = req.query.id;
    Essay.markEssayReviewed(id, function(err, doc){
        if(err){
            //handle
        }else{
            //tell client its all good
        }
    });

});


module.exports = router;
