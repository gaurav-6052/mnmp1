var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

// transform
var omitPrivate = function (doc, masterDataType) {
    delete masterDataType.id;
    delete masterDataType.__v;
    return masterDataType;
};

// options
var options = {
    toJSON: { virtuals: true, transform: omitPrivate },
    toObject: { virtuals: true, transform: omitPrivate }
};

// schema
var schema = new Schema({
    type: { type: String, required: true, index: { unique: true } },
},options);


// model
module.exports = mongoose.model('MasterDataType', schema);