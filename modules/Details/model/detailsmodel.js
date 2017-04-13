var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var plugins = require('../../../plugins');
var autopopulate = require('mongoose-autopopulate');

// transform
var omitPrivate = function (doc, details) {
   delete details.id;
       return details;
}

// options
var options = {
    toJSON: { virtuals: true, transform: omitPrivate },
    toObject: { virtuals: true, transform: omitPrivate }
};

var catSchema = new Schema({
	categoryName: {type: String},
    subcategoryName:{type: String}
});

var imageSchema = new Schema ({
    imageurls: {type: String}
});


var menuSchema = new Schema({
      shouldViewMenu: { type : String },
      menuUrl: { type: String },
      shouldOrderOnline: { type : String },
      onlineUrl: { type: String },
      shouldReservation: { type : String },
      shouldCoupon: { type : String }
});

var operationalTimingSchema = new Schema({
        forDay: { type: String },
        openingTime: { type: String },
        closingTime: { type: String }
});

var menuImageUrls = new Schema({
     imageurls : { type: String }
});

var photoUrlScema = new Schema({
   imageurls : { type: String }  
});

var videoUrlScema = new Schema({
   imageurls : { type: String }  
});

var audioUrlScema = new Schema({
   imageurls : { type: String }  
});

var paymentTypesSchema = new Schema({
     Cash : { type: String },
     Check : { type: String },  
     Credit : { type: String }  
});

 var reviewsSchema = new Schema({
        reviewText: { type: String },
        rating: { type : String },
        reviewedBy: { type: String },
        ratedOn: { type: String },
        imgUrl: { type: String },
        ownerComment: { type: String }

 });

 var couponsSchema = new Schema({

        id: { type: String },
        title: { type: String },
        couponDetail: { type: String },
        expireDate: { type: String },
        imgUrl: { type: String },
        externalLink: { type: String },
        couponsLeft: { type: String }
 });

      
var locationsSchema = new Schema({

       postalCode: { type: String },
       address: { type: String },
       locationName : { type: String },
        cityName: { type: String },
        phoneNo: { type: String },
        faxNo: { type: String }
 });

var contactDetailSchema = new Schema ({
	  emailId: { type: String },
      webUrl: { type: String },
      twitterUrl : { type: String },
      facebookUrl: { type: String },
      gPlusUrl: { type: String }
    

});
    
    var restrictionsSchema = new Schema({
    		canReview: { type : String }, 
            canUploadImage: { type : String }
    });
    

             

      

// schema
var schema = new Schema({
    categories : [catSchema],
    imageurls : [imageSchema],
    isFavourite : { type : String },
    menus : [menuSchema],
    openingTime : [operationalTimingSchema],
    menuImage : [menuImageUrls],
    photoUrl : [photoUrlScema],
    videoUrl : [videoUrlScema],
    audioUrl : [audioUrlScema],
    paymentTypes : [paymentTypesSchema],
    reviews : [reviewsSchema],
    reviewCount : { type: String },
    coupons : [couponsSchema],
    couponsCount: { type : String },
    isMusicProfile: { type : String },
    rating: { type : String },
    locations : [locationsSchema],
    contactDetais : [contactDetailSchema],
    restrictions : [restrictionsSchema],
    desc: { type : String },
    id: { type : String },
    businessType : { type : String },
    title: { type : String },
    timeZone: { type : String },
    businessLogo: { type : String },
    typeOfDishes: { type : String },
    priceRange: { type : String },
    isProfile: { type : String },
    primerVideoUrl: { type : String }
 
}, options);

// plugins
schema.plugin(plugins.mongooseFindPaginate);
schema.plugin(plugins.mongooseSearch, ['']);

// autopopulate plugin
schema.plugin(autopopulate);

module.exports = mongoose.model('details', schema);