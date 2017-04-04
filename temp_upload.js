//uploading to GD
var fs = require('fs');
var google = require('googleapis');
var drive = google.drive({ version: 'v3', auth: global.myGoogleAuth });

drive.files.create({
    resource: {
        name: 'Test_Doc',
        mimeType: 'application/vnd.google-apps.document'
    },
    media: {
        mimeType: 'application/msword',
        body: fs.createReadStream('public/GettingThere.docx')
    }
}, function(err, file) {
    if(err) {
        // Handle error
        console.log(err);
    } else {
        console.log('File Id: ', file.id);
    }
});

// Upload with permissions
var fs = require('fs');
var google = require('googleapis');
var drive = google.drive({ version: 'v3', auth: global.myGoogleAuth });

drive.files.create({
    resource: {
        name: 'Test_Doc_201',
        mimeType: 'application/vnd.google-apps.document'
    },
    media: {
        mimeType: 'application/msword',
        body: fs.createReadStream('public/GettingThere.docx')
    }
}, function(err, file) {
    if(err) {
        // Handle error
        console.log(err);
    } else {
        console.log('File Id: ', file.id);
        var google = require('googleapis');
        var drive = google.drive({ version: 'v2', auth: global.myGoogleAuth });

        //permissions

        //permission for reviewer
        drive.permissions.insert({
            'fileId': file.id,
            'resource': {
                "role": "reader",
                "type": "anyone",   //can change to a specific user
                "additionalRoles": [
                    "commenter"
                ]
            }
        }, callback)

        //permission for user
        drive.permissions.insert({
            'fileId': file.id,
            'resource': {
                "role": "writer",
                "type": "user",
                "value": "anish.chelseafc@gmail.com"
            }
        }, callback)
    }
});


function callback(err, resp, body) {
    console.log(body['body']['id']); //gets the permission id for the permission created
    //use the permission id to update permissions in the future
}

/*
 The user has writer permission always so that he/she can downloaded file
 with the tracked changes.
 Only issue - user has to be logged into gmail to be able to download the file

 Ideas:
    - Reviewer Method 1 (preferred)
        ~ Can give commenter permissions to everyone temporarily when the reviewer clicks on the link
        ~ Once the reviewer submits his review change the permission to view only using the permission id
    - Reviewer Method 2
        ~ Can give the specific reviewer commenter privileges and don't have to change it back
        ~ More hassle for the reviewer because he/she has to log into gmail first


   Final Idea:
   - Give 'anyone' 'commenter' permissions when the user wants to download or the reviewer wants to review
   - Delete the permission once the file has been downloaded or file has been reviewed
     ^using the permission id
 */