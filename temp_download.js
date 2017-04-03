var fs = require('fs');
var google = require('googleapis');
var drive = google.drive({ version: 'v2', auth: global.myGoogleAuth });
var fileId = '1ypxPlu1bQN1XWpYY4tvpMyx4fx_cRTsw6OAC1adXqrM';

drive.files.get({ fileId: fileId }, function(err, result) {
    var opn = require('opn');

    //either of the two method will work
    opn(result['exportLinks']['application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
    opn('https://docs.google.com/document/u/1/export?format=docx&id='+fileId);
    opn('https://docs.google.com/feeds/download/documents/export/Export?id='+fileId+'&exportFormat=docx'); //Definitely works

    //download on client system

    res.redirect('https://docs.google.com/feeds/download/documents/export/Export?id='+fileId+'&exportFormat=docx');
});