var express = require('express');
var router = express.Router();


router.post('/uploadFile', function(req, res, next) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    var fs = require('fs');
    var google = require('googleapis');
    var drive = google.drive({ version: 'v3', auth: global.myGoogleAuth });
    var streamifier = require('streamifier');

    drive.files.create({
        resource: {
            name: 'Uploaded_file_client',
            mimeType: 'application/vnd.google-apps.document'
        },
        media: {
            mimeType: 'application/msword',
            body: streamifier.createReadStream(req.files.essay.data)
        }
    }, function(err, file) {
        if(err) {
            // Handle error
            console.log(err);
        } else {
            console.log('File Id: ', file.id);
            res.send('File uploaded!');
        }
    });
});


module.exports = router;
