var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var bcrypt = require('bcryptjs');
var plugins = require('../../../plugins');
var autopopulate = require('mongoose-autopopulate');

// bcrypt password
var hashPass = function (value) {
    return bcrypt.hashSync(value);
};
// transform
var omitPrivate = function (doc, user) {
    delete user.password;
    delete user.facebookUserId;
    delete user.linkedUserId;
    delete user.id;
    delete user.__v;
    delete user.accConns;
    delete user.followedGC;
    return user;
};

// options
var options = {
    toJSON: { virtuals: true, transform: omitPrivate },
    toObject: { virtuals: true, transform: omitPrivate }
};

// schema
var schema = new Schema({
    // Personal profile information
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, required: true, trim: true, index: { unique: true }, lowercase: true },
    phone: { type: String, trim: true, index: true, unique: true, sparse: true },
    address: { type: String, trim: true, minLength: 1, maxLength: 500 },
    Created_at: { type: Date },
    password: { type: String, select: false, set: hashPass }
}, options);

// plugins
schema.plugin(plugins.mongooseFindPaginate);
schema.plugin(plugins.mongooseSearch, ['firstName', 'lastName', 'email','fullName']);

// autopopulate plugin
schema.plugin(autopopulate);


// Schema hooks method

schema.pre('save', function (next) {
    this.fullName = _.isString(this.lastName) ? (this.firstName + ' ' + this.lastName) : this.firstName;
    next();
});

// instance  methods

/**
 * Create mini object from this user document.
 */
schema.methods.toUserMini = function () {
    return {
        _id: this._id,
        fullName: this.fullName,
        profileImageFileId: this.profileImageFileId
    };
};

// model
module.exports = mongoose.model('User', schema);