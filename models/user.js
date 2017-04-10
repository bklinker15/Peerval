/**
 * Created by bwbas on 3/30/2017.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


//User schema
var UserSchema = mongoose.Schema({
    fname: String,
    lname: String,
    password: String,
    email: {
        type: String,
        index: true
    },
    major: String,
    university: String,
    phone: Number,
    year: String,
    isReviewer: {
        type: Boolean,
        default: false
    },
    reviewerId: mongoose.Schema.Types.ObjectId,
    dateJoined: {
        type: Date,
        default: Date.now
    },
    wallet: {
        type: Number,
        default: 0
    },
    uploadedEssayIds: [String]
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserByEmail = function(email, callback){
    var query = {email: email};
    User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
    // Load hash from your password DB.
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
};

