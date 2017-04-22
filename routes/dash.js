/**
 * Created by bwbas on 3/29/2017.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
    var User = require('../models/user');
    var Essay = require('../models/essay');

    var essays = {
        inProgress: [],
        reviewed: []
    };
    //find the user
    User.findById(req.user._id, function (err, user) {
        if (err) return handleError(err);
        if(user.uploadedEssayIds.length==0){
            res.render('dash', { title: 'Express' , essayArray: essays});
        }else {
            var ctr = 0;
            //loop through all the essay IDs for this user
            // for( var essayID = 0; essayID< user.uploadedEssayIds.length(); essayID++){
            user.uploadedEssayIds.forEach(function (essayID) {

                //find the essay
                Essay.findById(essayID, function (err, essay) {

                    //check if thumbnail already exists
                    // if(essay.thumbnailLink == undefined || essay.thumbnailLink.length==0) {
                    //     //get the thumbnail
                    //     var google = require('googleapis');
                    //     var drive = google.drive({version: 'v2', auth: global.myGoogleAuth});
                    //
                    //     drive.files.get({fileId: essay.fileId}, function (err, result) {
                    //         var thumbnail = result.thumbnailLink;
                    //         essay.thumbnailLink = thumbnail;
                    //         essay.save(function (err, updatedUser) {
                    //             if (err) console.log(err);;
                    //         });
                    //         //add essay object to the array
                    //         essays.push({
                    //             title: essay.title,
                    //             fileId: essay.fileId,
                    //             thumbnailLink: thumbnail,
                    //             status: essay.status,
                    //             date: essay.uploadDate,
                    //             subject: essay.subject
                    //         });
                    //         ctr++;
                    //         if (ctr == user.uploadedEssayIds.length) {
                    //             res.render('dash', {title: 'Express', essayArray: essays});
                    //         }
                    //     });
                    // }
                    // else{
                    //     essays.push({
                    //         title: essay.title,
                    //         fileId: essay.fileId,
                    //         thumbnailLink: essay.thumbnailLink,
                    //         status: essay.status,
                    //         date: essay.uploadDate,
                    //         subject: essay.subject
                    //     })
                    //     ctr++;
                    //     if (ctr == user.uploadedEssayIds.length) {
                    //         res.render('dash', {title: 'Express', essayArray: essays});
                    //     }
                    // }
                        //add to different arrays based on status
                        if(essay.status == 'Not_Reviewed' || essay.status == "In_Review") {
                            essays.inProgress.push({
                                title: essay.title,
                                fileId: essay.fileId,
                                status: essay.status,
                                date: essay.uploadDate,
                                subject: essay.subject
                            });
                        }
                        else{  //reviewed
                            essays.reviewed.push({
                                title: essay.title,
                                fileId: essay.fileId,
                                status: essay.status,
                                date: essay.uploadDate,
                                subject: essay.subject
                            });
                        }
                        ctr++;

                    //add essay object to the array
                    if (ctr == user.uploadedEssayIds.length) {
                            //render the page
                            res.render('dash', {title: 'Express', essayArray: essays});
                        }
                });

            });
        }
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



/*
success message:
 <% if(success_msg){%>
 <div  style="color: #2eff22"><%=success_msg%></div> <br>
 <%}%>


display uploaded essays:
 <% for(var i=0 ; i<essayArray.length ; i++){ %>
 <a href="/files/downloadFile?fileId=<%= essayArray[i].fileId %>">
 <img src='<%= essayArray[i].thumbnailLink %>'>
 </a>
 <% }%>
 */