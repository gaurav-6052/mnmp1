var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
//var bcrypt = require('bcryptjs');
var plugins = require('../../../plugins');
var autopopulate = require('mongoose-autopopulate');

// transform
var omitPrivate = function (doc, coupon) {
    delete coupon.id;
    
    return coupon;
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
    title: { type: String },
    couponDetail: { type: String},
    expireDate: { type: String },
    imgurl: { type: String },
    externalLink : { type: String },
    couponsLeft :  { type: String },
    businessName :  { type: String },
  
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


*/
// model
module.exports = mongoose.model('coupon', schema);