var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


//essay schema
var EssaySchema = mongoose.Schema({
    authorEmail:String,
    authorId: String,
    fileId: String,
    status: String,
    thumbnailLink: String,
    GDalternateLink: String,
    priority: Number,
    reviewerId: String,
    uploadDate: Date,
    dueDate: Date,
    prompt: String,
    pageLength: Number,
    topic: String,
    classPrefix: String,
    classLevel: Number,
    title: String,
    rewardAmt: Number,
    wordCount: Number
});

var Essay = module.exports = mongoose.model('Essay', EssaySchema);

module.exports.getEssayById = function(id, callback){
    Essay.findById(id, callback);
};

module.exports.getReviewableEssaysByTopic = function(user_id, callback){
    Essay.find({status: "Not_Reviewed", authorId: {$ne: user_id}}, callback);
};

module.exports.markEssayInProgress = function(essay_id, callback){
    var query = {'_id': essay_id};
    Essay.findOneAndUpdate(query, {status: "In_Review"}, {upsert: false}, callback);
};

module.exports.markEssayReviewed = function(essay_id, callback){
    var query = {'_id': essay_id};
    Essay.findOneAndUpdate(query, {status: "Reviewed"}, {upsert: false}, callback);
};