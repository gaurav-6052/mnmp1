var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;


// transform
var omitPrivate = function (doc, masterData) {
    delete masterData.type;
    delete masterData.id;
    delete masterData.__v;
    return masterData;
};

// options
var options = {
    toJSON: { virtuals: true, transform: omitPrivate },
    toObject: { virtuals: true, transform: omitPrivate },
    collection: 'masterdata'
};


// schema
var schema = new Schema({
    type: { type: String, required: true, lowercase: true },
    value: { type: Schema.Types.Mixed, required: true }
}, options);

// model
module.exports = mongoose.model('MasterData', schema);