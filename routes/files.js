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
                            if (err) console.log(err);;
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

module.exports = router;
