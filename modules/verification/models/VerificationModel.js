var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var config = require('config');

// verification document expiry in seconds
var expireIn = config.get('verificationExpireIn');

// transform for sending as json
function omitPrivate(doc, obj) {
    delete obj.__v;
    delete obj.id;
    delete obj.verified;
    return obj;
}

// schema options
var options = { toJSON: { transform: omitPrivate } };

// schema
var schema = new Schema({
    type: { type: String, required: true },
    value: { type: String },
    purpose: { type: String, required: true },
    code: { type: String, required: true },
    userType: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: expireIn },
    verified: { type: Boolean, default: false, required: true }
}, options);

// model
module.exports = mongoose.model('Verification', schema);