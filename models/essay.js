var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


//User schema
var EssaySchema = mongoose.Schema({
    authorEmail:String,
    authorId: String,
    fileId: String,
    status: String,
    thumbnailLink: String,
    downloadLink: String,
    GDalternateLink: String,
    priority: Number,
    reviewerId: String,
    uploadDate: Date,

    dueDate: Date,
    prompt: String,
    pageLength: Number,
    subject: String,
    classPrefix: String,
    classLevel: Number,
    title: String,
    rewardAmt: Number
});

var Essay = module.exports = mongoose.model('Essay', EssaySchema);
