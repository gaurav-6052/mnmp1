var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
//var bcrypt = require('bcryptjs');
var plugins = require('../../../plugins');
var autopopulate = require('mongoose-autopopulate');

// transform
var omitPrivate = function (doc, categery) {
   delete categery.id;
    return categery;
}

// options
var options = {
    toJSON: { virtuals: true, transform: omitPrivate },
    toObject: { virtuals: true, transform: omitPrivate }
};

// sub schema of sub catogery
var sub_schema = new Schema({
    
    subcategoryId: { type: String },
    subcategoryName: { type: String }
   
});
// schema
var schema = new Schema({
 
    categoryId: { type: String },
    categoryName: { type: String },
    //subcategory: [sub_schema]
   
}, options);

// plugins
schema.plugin(plugins.mongooseFindPaginate);
schema.plugin(plugins.mongooseSearch, ['']);

// autopopulate plugin
schema.plugin(autopopulate);

module.exports = mongoose.model('categories', schema);