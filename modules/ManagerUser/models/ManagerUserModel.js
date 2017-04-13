var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

// bcrypt password
var hashPass = function (value) {
    return bcrypt.hashSync(value);
}

// transform
var omitPrivate = function (doc, manager) {
    delete manager.password;
    delete manager.id;
    delete manager.__v;
    return manager;
};

// options
var options = {
    toJSON: { virtuals: true, transform: omitPrivate },
    toObject: { virtuals: true, transform: omitPrivate }
};

// schema
var schema = new Schema({
    name: { type: String, default: 'Manager' },
    email: { type: String, required: true, lowercase: true },
    password: { type: String, required: true, select: false }
}, options);

// model
module.exports = mongoose.model('ManagerUser', schema);