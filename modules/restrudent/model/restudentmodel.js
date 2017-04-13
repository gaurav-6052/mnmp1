var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
//var bcrypt = require('bcryptjs');
var plugins = require('../../../plugins');
var autopopulate = require('mongoose-autopopulate');

// transform
var omitPrivate = function (doc, restrudent) {
   delete restrudent.id;
    return restrudent;
}

// options
var options = {
    toJSON: { virtuals: true, transform: omitPrivate },
    toObject: { virtuals: true, transform: omitPrivate }
};


// schema
var schema = new Schema({
 
   
   lng: { type : String}
   
}, options);

// plugins
schema.plugin(plugins.mongooseFindPaginate);
schema.plugin(plugins.mongooseSearch, ['']);

// autopopulate plugin
schema.plugin(autopopulate);

module.exports = mongoose.model('restrudent', schema);