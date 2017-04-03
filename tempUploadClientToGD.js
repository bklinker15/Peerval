//example form body:
// <form ref='uploadForm' action='http://localhost:3000/uploadURL' method='post' encType="multipart/form-data">
//     <input type="file" name="sampleFile" />
//     <input type='submit' value='Upload!' />
// </form>

//uploads the file directly from the client to the google drive
if (!req.files)
    return res.status(400).send('No files were uploaded.');

var fs = require('fs');
var google = require('googleapis');
var drive = google.drive({ version: 'v3', auth: global.myGoogleAuth });
var streamifier = require('streamifier');

drive.files.create({
    resource: {
        name: 'Uploaded_file',
        mimeType: 'application/vnd.google-apps.document'
    },
    media: {
        mimeType: 'application/msword',
        body: streamifier.createReadStream(req.files.sampleFile.data)
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