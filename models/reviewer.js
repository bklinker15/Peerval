/**
 * Created by bwbas on 4/9/2017.
 */
var mongoose = require('mongoose');


//Reviewer schema
var ReviewerSchema = mongoose.Schema({
    userId: mongoose.Schema.ObjectId,
    essaysToReview: [mongoose.Schema.Types.ObjectId],
    ratingCount: {
        type: Number,
        default: 0
    },
    ratingTotal: {
        type: Number,
        default: 0
    },
    textReviews: [String],
    totalEarningsToDate: {
        type: Number,
        default: 0
    }
});

var Reviewer = module.exports = mongoose.model('Reviewer', ReviewerSchema);

module.exports.createReviewer = function(userId, callback){
    var newReviewer = new Reviewer ({
        userId : userId
    });

    newReviewer.save(callback(newReviewer));
};

module.exports.getReviewerById = function(id, callback){
    Reviewer.findById(id, callback);
};


