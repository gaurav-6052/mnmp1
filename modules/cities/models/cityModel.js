var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
//var bcrypt = require('bcryptjs');
var plugins = require('../../../plugins');
var autopopulate = require('mongoose-autopopulate');

// transform
var omitPrivate = function (doc, city) {
    delete city.id;
    delete city.c_name;
    delete city.lat;
    delete city.lng;
    delete city.imgurl;
    return city;
};

// options
var options = {
    toJSON: { virtuals: true, transform: omitPrivate },
    toObject: { virtuals: true, transform: omitPrivate }
};

// sub schema
var sub_schema = new Schema({
    // Personal profile information
    c_name: { type: String },
     lat: { type: String},
    lng: { type: String },
    imgurl: { type: String }
   
});
// schema
var schema = new Schema({
    // Personal profile information
    c_name: { type: String },
     lat: { type: String},
    lng: { type: String },
    imgurl: { type: String },
   // sub_location: [sub_schema]
   
}, options);

// plugins
schema.plugin(plugins.mongooseFindPaginate);
schema.plugin(plugins.mongooseSearch, ['']);

// autopopulate plugin
schema.plugin(autopopulate);

/*
schema.virtual('functionName').get(function () {
    return _.isObject(this.functionObj) ? this.functionObj.value : '';
});

// virtuals
schema.virtual('dob_ms').get(function () {
    return this.dob ? this.dob.getTime() : null;
});
*/
// Schema hooks method
/*
schema.pre('save', function (next) {
    //this.fullName = _.isString(this.lastName) ? (this.firstName + ' ' + this.lastName) : this.firstName;
    next();
});

// instance  methods

/**
 * Create mini object from this user document.
 */
/*schema.methods.toUserMini = function () {
    return {
        _id: this._id,
        city: this.name,
    };
};
*/
// model
module.exports = mongoose.model('cities', schema);