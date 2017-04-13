var CityModel = require('./model/couponmodel');

var fullPopulate = [
 { path: 'title', select: '_id value' },
 { path: 'couponDetail', select: '_id value' },
 { path: 'expireDate', select: '_id value' },
 { path: 'imgurl', select: '_id value' },
 { path: 'externalLink', select: '_id value' },
 { path: 'couponsLeft', select: '_id value' },
 { path: 'businessName', select: '_id value' }
    
];

/**
 * City module
 */
var couponModule = {};
module.exports = couponModule;



couponModule.getcoupon = function (title,couponDetail,expireDate,imgurl,externalLink,couponsLeft,businessName) 
{

    // find one by 
    console.log("getcoupon");
     return CityModel.find(title,couponDetail,expireDate,imgurl,externalLink,couponsLeft,businessName).populate(fullPopulate).exec();
    
};