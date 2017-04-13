var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var bcrypt = require('bcryptjs');

// bcrypt password
var hashPass = function (value) {
    return bcrypt.hashSync(value);
};

// transform
var omitPrivate = function (doc, admin) {
    delete admin.password;
    delete admin.__v;
    delete admin.id;
    return admin;
};

// options
var options = {
    toJSON: { transform: omitPrivate },
    toObject: { transform: omitPrivate }
};

// schema
var schema = new Schema({
    fullName: { type: String, default: 'admin' },
    email: { type: String, required: true, index: { unique: true }, lowercase: true },
    password: { type: String, required: true, select: false, set: hashPass }
}, options);

// model
module.exports = mongoose.model('AdminUser', schema);