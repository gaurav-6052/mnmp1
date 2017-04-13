var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var plugins = require('../../../plugins');
var autopopulate = require('mongoose-autopopulate');

// transform
var omitPrivate = function (doc, special) {
   delete special.id;
       return special;
}

// options
var options = {
    toJSON: { virtuals: true, transform: omitPrivate },
    toObject: { virtuals: true, transform: omitPrivate }
};

    var contactDetailSchema = new Schema({
        webUrl : {type: String}
    });
     
    
    var locationsSchema = new Schema({
        postalCode:{type: String},
        address:{type: String},
        locationName:{type: String} ,
        cityName:{type: String} ,
        phoneNo: {type: Number},
        lat: {type: String},
        lng: {type: String}
    });
      
// schema
var schema = new Schema({
  businessType : {type: String},
  title : {type: String},
  timeZone: {type: String},
  desc: {type: String},
  businessName: {type: String},
  businessId : {type: String},
  logo: {type: String},
  date: {type: String},
  startTim: {type: String},
  endTime: {type: String},
  videoUrl: {type: String},
  isDailyEvent : {type: String},
  timings:{type: String},
  //contactDetais : [contactDetailSchema],
  locations : [locationsSchema]    
}, options);

// plugins
schema.plugin(plugins.mongooseFindPaginate);
schema.plugin(plugins.mongooseSearch, ['']);

// autopopulate plugin
schema.plugin(autopopulate);

module.exports = mongoose.model('special', schema);