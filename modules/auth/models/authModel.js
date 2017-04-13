var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var config = require('config');

// token expiry in seconds
var expireIn = config.get('tokenExpireIn');

// transform for sending as json
function omitPrivate(doc, obj) {
    delete obj.createdAt;
    delete obj.__v;
    delete obj.id;
    return obj;
}

// schema options
var options = { toJSON: { transform: omitPrivate } };

// schema
var schema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    userType: { type: String, required: true },
    token: { type: String, required: true, index: { unique: true } },
    createdAt: { type: Date, default: Date.now, expires: expireIn }
}, options);

// model
module.exports = mongoose.model('Auth', schema);